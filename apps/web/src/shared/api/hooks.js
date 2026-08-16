/**
 * TanStack Query hooks.
 *
 * Query config encodes principle P4 (degrade, never fail): cached data is served
 * while revalidating, and 4xx errors are never retried because retrying a bad
 * request cannot succeed.
 */

import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, authApi, profileApi, referenceApi, tokens } from './client';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 24 * 60 * 60 * 1000, // keep for a day so a reopened app has data offline
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.isClientError) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false, // farmers on metered data; don't refetch on tab switch
    },
  },
});

export const keys = {
  me: ['me'],
  farms: ['farms'],
  farm: (id) => ['farms', id],
  plots: (farmId) => ['farms', farmId, 'plots'],
  plot: (id) => ['plots', id],
  landUnits: (state) => ['reference', 'land-units', state ?? null],
  options: ['reference', 'options'],
};

// --------------------------------------------------------------------- auth

export function useRequestOtp() {
  return useMutation({ mutationFn: (phone) => authApi.requestOtp(phone) });
}

export function useVerifyOtp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ phone, otp }) => authApi.verifyOtp(phone, otp),
    onSuccess: () => qc.invalidateQueries(),
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => qc.clear(),
  });
}

// --------------------------------------------------------------------- profile

export function useMe() {
  return useQuery({
    queryKey: keys.me,
    queryFn: () => profileApi.me(),
    enabled: tokens.isAuthenticated,
  });
}

export function useUpdateMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch) => profileApi.updateMe(patch),
    onSuccess: (result) => qc.setQueryData(keys.me, result),
  });
}

export function useFarms() {
  return useQuery({
    queryKey: keys.farms,
    queryFn: () => profileApi.listFarms(),
    enabled: tokens.isAuthenticated,
  });
}

export function useCreateFarm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (farm) => profileApi.createFarm(farm),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.farms }),
  });
}

export function useUpdateFarm(farmId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch) => profileApi.updateFarm(farmId, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.farms });
      qc.invalidateQueries({ queryKey: keys.farm(farmId) });
    },
  });
}

export function usePlots(farmId) {
  return useQuery({
    queryKey: keys.plots(farmId),
    queryFn: () => profileApi.listPlots(farmId),
    enabled: Boolean(farmId) && tokens.isAuthenticated,
  });
}

export function useCreatePlot(farmId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (plot) => profileApi.createPlot(farmId, plot),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.plots(farmId) });
      qc.invalidateQueries({ queryKey: keys.farms }); // total acreage changed
    },
  });
}

export function useUpdatePlot(plotId, farmId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch) => profileApi.updatePlot(plotId, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.plot(plotId) });
      qc.invalidateQueries({ queryKey: keys.plots(farmId) });
    },
  });
}

export function useDeletePlot(farmId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (plotId) => profileApi.deletePlot(plotId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.plots(farmId) });
      qc.invalidateQueries({ queryKey: keys.farms });
    },
  });
}

// --------------------------------------------------------------------- reference

export function useLandUnits(state) {
  return useQuery({
    queryKey: keys.landUnits(state),
    queryFn: () => referenceApi.landUnits(state),
    staleTime: 24 * 60 * 60 * 1000, // conversion factors effectively never change
  });
}

export function useOptions() {
  return useQuery({
    queryKey: keys.options,
    queryFn: () => referenceApi.options(),
    staleTime: 24 * 60 * 60 * 1000,
  });
}
