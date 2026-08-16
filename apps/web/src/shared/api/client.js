/**
 * API client.
 *
 * Two responsibilities beyond plain fetch:
 *
 *  1. Unwraps the `{data, meta}` envelope while KEEPING `meta` reachable, so
 *     every screen can tell the farmer where a number came from and how old it
 *     is (§1.1 API Design, principle P5).
 *  2. Transparently refreshes an expired access token once, then retries.
 */

const API_PREFIX = '/api/v1';

const ACCESS_KEY = 'sk_access_token';
const REFRESH_KEY = 'sk_refresh_token';

// --------------------------------------------------------------------- tokens

export const tokens = {
  get access() {
    return localStorage.getItem(ACCESS_KEY);
  },
  get refresh() {
    return localStorage.getItem(REFRESH_KEY);
  },
  set({ access_token, refresh_token }) {
    if (access_token) localStorage.setItem(ACCESS_KEY, access_token);
    if (refresh_token) localStorage.setItem(REFRESH_KEY, refresh_token);
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
  get isAuthenticated() {
    return Boolean(localStorage.getItem(ACCESS_KEY));
  },
};

// --------------------------------------------------------------------- errors

export class ApiError extends Error {
  constructor({ code, message, message_localized, details, request_id }, status) {
    // Prefer the localized text — the farmer reads this, not the developer.
    super(message_localized || message || 'Request failed');
    this.name = 'ApiError';
    this.code = code;
    this.messageEn = message;
    this.messageLocalized = message_localized;
    this.details = details || {};
    this.requestId = request_id;
    this.status = status;
  }

  /** Retrying will not help for these — the request itself is wrong. */
  get isClientError() {
    return this.status >= 400 && this.status < 500;
  }
}

/**
 * Result of a successful call. `data` is the payload; `meta` is provenance.
 *
 * Screens should render `meta.dataAsOf` / `meta.isStale` rather than presenting
 * a bare number as if it were current.
 */
class ApiResult {
  constructor(data, meta) {
    this.data = data;
    this.meta = {
      source: meta?.source ?? null,
      dataAsOf: meta?.data_as_of ? new Date(meta.data_as_of) : null,
      isStale: Boolean(meta?.is_stale),
      modelVersion: meta?.model_version ?? null,
      computedInMs: meta?.computed_in_ms ?? null,
      requestId: meta?.request_id ?? null,
    };
  }
}

// --------------------------------------------------------------------- refresh

let refreshInFlight = null;

async function refreshAccessToken() {
  // Collapse concurrent 401s into a single refresh call, otherwise parallel
  // requests each rotate the refresh token and all but one get invalidated.
  if (refreshInFlight) return refreshInFlight;

  const refreshToken = tokens.refresh;
  if (!refreshToken) return null;

  refreshInFlight = (async () => {
    try {
      const response = await fetch(`${API_PREFIX}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      if (!response.ok) {
        tokens.clear();
        return null;
      }
      const body = await response.json();
      tokens.set(body.data);
      return body.data.access_token;
    } catch {
      tokens.clear();
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

// --------------------------------------------------------------------- core

async function request(path, { method = 'GET', body, auth = true, language } = {}, isRetry = false) {
  const headers = { 'Accept-Language': language || localStorage.getItem('sk_lang') || 'hi' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth && tokens.access) headers.Authorization = `Bearer ${tokens.access}`;

  let response;
  try {
    response = await fetch(`${API_PREFIX}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (cause) {
    // Offline or DNS failure — surfaced as a typed error so the UI can show the
    // offline banner instead of a raw stack (P4).
    throw new ApiError(
      {
        code: 'NETWORK_ERROR',
        message: 'Network unavailable',
        message_localized: 'इंटरनेट कनेक्शन नहीं है',
      },
      0,
      { cause }
    );
  }

  if (response.status === 204) return new ApiResult(null, null);

  // One transparent refresh-and-retry on an expired access token.
  if (response.status === 401 && auth && !isRetry) {
    const fresh = await refreshAccessToken();
    if (fresh) return request(path, { method, body, auth, language }, true);
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new ApiError(
      {
        code: 'MALFORMED_RESPONSE',
        message: `Unparseable response (HTTP ${response.status})`,
        message_localized: 'सर्वर से गलत जवाब मिला',
      },
      response.status
    );
  }

  if (!response.ok) throw new ApiError(payload.error ?? {}, response.status);

  return new ApiResult(payload.data, payload.meta);
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  patch: (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
  delete: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
};

// --------------------------------------------------------------------- endpoints

export const authApi = {
  requestOtp: (phone) => api.post('/auth/otp/request', { phone }, { auth: false }),

  async verifyOtp(phone, otp) {
    const result = await api.post('/auth/otp/verify', { phone, otp }, { auth: false });
    tokens.set(result.data);
    return result;
  },

  async logout() {
    try {
      await api.post('/auth/logout', { refresh_token: tokens.refresh });
    } catch {
      // Best-effort: the user asked to log out, so a network or server failure
      // must not leave them stuck in a logged-in UI. Local tokens are cleared
      // regardless; the server-side copies expire on their own TTL.
    } finally {
      tokens.clear();
    }
  },
};

export const profileApi = {
  me: () => api.get('/me'),
  updateMe: (patch) => api.patch('/me', patch),

  listFarms: () => api.get('/farms'),
  getFarm: (farmId) => api.get(`/farms/${farmId}`),
  createFarm: (farm) => api.post('/farms', farm),
  updateFarm: (farmId, patch) => api.patch(`/farms/${farmId}`, patch),

  listPlots: (farmId) => api.get(`/farms/${farmId}/plots`),
  createPlot: (farmId, plot) => api.post(`/farms/${farmId}/plots`, plot),
  getPlot: (plotId) => api.get(`/plots/${plotId}`),
  updatePlot: (plotId, patch) => api.patch(`/plots/${plotId}`, patch),
  deletePlot: (plotId) => api.delete(`/plots/${plotId}`),

  addSoilTest: (plotId, test) => api.post(`/plots/${plotId}/soil-test`, test),
};

export const referenceApi = {
  /** Units for a state, regional first — a UP farmer thinks in bigha (FR-1.5). */
  landUnits: (state) =>
    api.get(`/reference/land-units${state ? `?state=${encodeURIComponent(state)}` : ''}`, {
      auth: false,
    }),
  options: () => api.get('/reference/options', { auth: false }),
};

export const systemApi = {
  health: () => fetch('/health').then((r) => r.json()),
};
