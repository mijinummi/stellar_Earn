import type { NextConfig } from 'next';
import { cspHeaders } from './next.config.csp';
import withBundleAnalyzer from '@next/bundle-analyzer';

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  async headers() {
    return cspHeaders;
  },
};

export default withAnalyzer(nextConfig);
