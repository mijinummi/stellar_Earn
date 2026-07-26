'use client';

import { useReportWebVitals } from 'next/navigation';

export interface WebVitalMetric {
  id: string;
  name: string;
  label: 'web-vital' | 'custom';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  navigationType: string;
}

/**
 * Dispatches Web Vitals metrics to the production monitoring endpoint.
 * Uses navigator.sendBeacon when available to prevent blocking page unloading.
 */
export function sendWebVitalsToAnalytics(metric: WebVitalMetric): void {
  const body = JSON.stringify({
    id: metric.id,
    name: metric.name,
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    rating: metric.rating,
    delta: Math.round(metric.name === 'CLS' ? metric.delta * 1000 : metric.delta),
    navigationType: metric.navigationType,
    page: typeof window !== 'undefined' ? window.location.pathname : '',
    timestamp: Date.now(),
  });

  const url = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT || '/api/analytics/vitals';

  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' });
    navigator.sendBeacon(url, blob);
  } else {
    fetch(url, {
      body,
      method: 'POST',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch((error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Web Vitals] Failed to send metric:', error);
      }
    });
  }
}

export function WebVitals(): null {
  useReportWebVitals((metric) => {
    sendWebVitalsToAnalytics(metric as WebVitalMetric);
  });

  return null;
}