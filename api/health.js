/**
 * Health check endpoint for Vercel serverless functions & local dev.
 * GET /api/health
 */
export default function handler(req, res) {
  const ltaConfigured = Boolean(process.env.LTA_ACCOUNT_KEY);

  const healthData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime ? Math.floor(process.uptime()) : null,
    environment: process.env.NODE_ENV || 'production',
    service: 'Singapore Civic Transit Pulse API',
    integrations: {
      ltaDataMall: {
        configured: ltaConfigured,
        status: ltaConfigured ? 'READY' : 'KEY_MISSING',
        note: ltaConfigured
          ? 'LTA_ACCOUNT_KEY is configured.'
          : 'Set LTA_ACCOUNT_KEY in environment variables to enable live DataMall feed.',
      },
    },
  };

  if (typeof res.status === 'function') {
    return res.status(200).json(healthData);
  } else {
    // Raw HTTP fallback if needed
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(healthData));
  }
}
