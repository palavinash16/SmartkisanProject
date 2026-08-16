import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError, api, authApi, tokens } from '../shared/api/client';

function jsonResponse(body, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

beforeEach(() => {
  localStorage.clear();
  globalThis.fetch = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('token store', () => {
  it('persists and clears tokens', () => {
    expect(tokens.isAuthenticated).toBe(false);
    tokens.set({ access_token: 'a', refresh_token: 'r' });
    expect(tokens.access).toBe('a');
    expect(tokens.isAuthenticated).toBe(true);
    tokens.clear();
    expect(tokens.access).toBeNull();
  });
});

describe('response envelope', () => {
  it('exposes data and provenance separately', async () => {
    fetch.mockResolvedValue(
      jsonResponse({
        data: { modal_price: 4500 },
        meta: {
          source: 'AGMARKNET via data.gov.in',
          data_as_of: '2026-08-04T12:00:46Z',
          is_stale: false,
          model_version: null,
        },
      })
    );

    const result = await api.get('/mandi/prices', { auth: false });

    expect(result.data.modal_price).toBe(4500);
    expect(result.meta.source).toBe('AGMARKNET via data.gov.in');
    expect(result.meta.dataAsOf).toBeInstanceOf(Date);
    expect(result.meta.isStale).toBe(false);
  });

  it('surfaces staleness so the UI can label cached data (P4)', async () => {
    fetch.mockResolvedValue(
      jsonResponse({
        data: [],
        meta: { source: 'AGMARKNET', data_as_of: '2026-08-03T12:00:00Z', is_stale: true },
      })
    );

    const result = await api.get('/mandi/prices', { auth: false });
    expect(result.meta.isStale).toBe(true);
  });

  it('reports model provenance when a prediction is involved', async () => {
    fetch.mockResolvedValue(
      jsonResponse({
        data: { predicted: 8420 },
        meta: { source: 'SmartKisan', model_version: 'price-forecast-v1.3.0' },
      })
    );

    const result = await api.get('/mandi/forecast', { auth: false });
    expect(result.meta.modelVersion).toBe('price-forecast-v1.3.0');
  });

  it('handles 204 with no body', async () => {
    fetch.mockResolvedValue({ ok: true, status: 204, json: async () => undefined });
    const result = await api.delete('/plots/abc');
    expect(result.data).toBeNull();
  });
});

describe('errors', () => {
  it('prefers the localized message the farmer will read', async () => {
    fetch.mockResolvedValue(
      jsonResponse(
        {
          error: {
            code: 'PLOT_NOT_FOUND',
            message: 'Plot not found',
            message_localized: 'खेत का टुकड़ा नहीं मिला',
            request_id: 'req_1',
          },
        },
        404
      )
    );

    await expect(api.get('/plots/x')).rejects.toMatchObject({
      code: 'PLOT_NOT_FOUND',
      message: 'खेत का टुकड़ा नहीं मिला',
      requestId: 'req_1',
      status: 404,
    });
  });

  it('flags client errors so they are not retried', async () => {
    fetch.mockResolvedValue(jsonResponse({ error: { code: 'VALIDATION_ERROR' } }, 400));
    try {
      await api.get('/x', { auth: false });
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error.isClientError).toBe(true);
    }
  });

  it('turns a network failure into a typed offline error', async () => {
    fetch.mockRejectedValue(new TypeError('Failed to fetch'));
    await expect(api.get('/me')).rejects.toMatchObject({
      code: 'NETWORK_ERROR',
      status: 0,
    });
  });

  it('reports an unparseable body rather than throwing a raw SyntaxError', async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => {
        throw new SyntaxError('Unexpected token');
      },
    });
    await expect(api.get('/x', { auth: false })).rejects.toMatchObject({
      code: 'MALFORMED_RESPONSE',
    });
  });
});

describe('token refresh', () => {
  it('refreshes once on 401 and retries the original request', async () => {
    tokens.set({ access_token: 'expired', refresh_token: 'valid-refresh' });

    fetch
      .mockResolvedValueOnce(jsonResponse({ error: { code: 'TOKEN_EXPIRED' } }, 401))
      .mockResolvedValueOnce(
        jsonResponse({ data: { access_token: 'fresh', refresh_token: 'r2' }, meta: {} })
      )
      .mockResolvedValueOnce(jsonResponse({ data: { name: 'Ramesh' }, meta: { source: 'x' } }));

    const result = await api.get('/me');

    expect(result.data.name).toBe('Ramesh');
    expect(tokens.access).toBe('fresh');
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it('does not loop when the refresh itself fails', async () => {
    tokens.set({ access_token: 'expired', refresh_token: 'dead' });

    fetch
      .mockResolvedValueOnce(jsonResponse({ error: { code: 'TOKEN_EXPIRED' } }, 401))
      .mockResolvedValueOnce(jsonResponse({ error: { code: 'TOKEN_REUSED' } }, 401));

    await expect(api.get('/me')).rejects.toBeInstanceOf(ApiError);
    expect(tokens.access).toBeNull(); // logged out
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('does not attempt refresh when there is no refresh token', async () => {
    fetch.mockResolvedValue(jsonResponse({ error: { code: 'UNAUTHORIZED' } }, 401));
    await expect(api.get('/me')).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});

describe('request construction', () => {
  it('attaches the bearer token when authenticated', async () => {
    tokens.set({ access_token: 'tok' });
    fetch.mockResolvedValue(jsonResponse({ data: {}, meta: {} }));

    await api.get('/me');

    expect(fetch.mock.calls[0][1].headers.Authorization).toBe('Bearer tok');
  });

  it('omits the bearer token on public endpoints', async () => {
    tokens.set({ access_token: 'tok' });
    fetch.mockResolvedValue(jsonResponse({ data: {}, meta: {} }));

    await api.get('/reference/land-units', { auth: false });

    expect(fetch.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });

  it('sends the farmer language so errors come back localized', async () => {
    localStorage.setItem('sk_lang', 'pa');
    fetch.mockResolvedValue(jsonResponse({ data: {}, meta: {} }));

    await api.get('/x', { auth: false });

    expect(fetch.mock.calls[0][1].headers['Accept-Language']).toBe('pa');
  });
});

describe('authApi', () => {
  it('stores tokens on successful OTP verification', async () => {
    fetch.mockResolvedValue(
      jsonResponse({
        data: { access_token: 'a', refresh_token: 'r', is_new_user: true },
        meta: { source: 'SmartKisan auth' },
      })
    );

    const result = await authApi.verifyOtp('+919876543210', '123456');

    expect(tokens.access).toBe('a');
    expect(result.data.is_new_user).toBe(true);
  });

  it('clears tokens locally even if the server logout fails', async () => {
    tokens.set({ access_token: 'a', refresh_token: 'r' });
    fetch.mockRejectedValue(new TypeError('offline'));

    await authApi.logout();

    expect(tokens.isAuthenticated).toBe(false);
  });
});
