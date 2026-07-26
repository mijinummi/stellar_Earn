import { sendWebVitalsToAnalytics, WebVitalMetric } from './WebVitals';

describe('WebVitals Analytics Reporter', () => {
  const originalSendBeacon = navigator.sendBeacon;
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    Object.defineProperty(navigator, 'sendBeacon', {
      value: originalSendBeacon,
      writable: true,
    });
    global.fetch = originalFetch;
  });

  const sampleMetric: WebVitalMetric = {
    id: 'v3-1628100000000-1234567890123',
    name: 'LCP',
    label: 'web-vital',
    value: 2150.4,
    rating: 'good',
    delta: 2150.4,
    navigationType: 'navigate',
  };

  it('uses navigator.sendBeacon when available', () => {
    const sendBeaconMock = jest.fn().mockReturnValue(true);
    Object.defineProperty(navigator, 'sendBeacon', {
      value: sendBeaconMock,
      writable: true,
    });

    sendWebVitalsToAnalytics(sampleMetric);

    expect(sendBeaconMock).toHaveBeenCalledTimes(1);
    const [url, body] = sendBeaconMock.mock.calls[0];
    expect(url).toBe('/api/analytics/vitals');
    expect(JSON.parse(body as string)).toMatchObject({
      name: 'LCP',
      value: 2150,
      rating: 'good',
    });
  });

  it('falls back to fetch with keepalive: true when sendBeacon is unsupported', () => {
    Object.defineProperty(navigator, 'sendBeacon', {
      value: undefined,
      writable: true,
    });

    const fetchMock = jest.fn().mockResolvedValue(new Response());
    global.fetch = fetchMock;

    sendWebVitalsToAnalytics(sampleMetric);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/analytics/vitals',
      expect.objectContaining({
        method: 'POST',
        keepalive: true,
      }),
    );
  });

  it('normalizes CLS values appropriately', () => {
    const sendBeaconMock = jest.fn();
    Object.defineProperty(navigator, 'sendBeacon', {
      value: sendBeaconMock,
      writable: true,
    });

    const clsMetric: WebVitalMetric = { ...sampleMetric, name: 'CLS', value: 0.042, delta: 0.042 };
    sendWebVitalsToAnalytics(clsMetric);

    const body = JSON.parse(sendBeaconMock.mock.calls[0][1]);
    expect(body.value).toBe(42);
  });
});