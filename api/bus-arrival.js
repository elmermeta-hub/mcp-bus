/**
 * LTA DataMall v3 Bus Arrival API Endpoint
 * GET /api/bus-arrival?BusStopCode=04121[&ServiceNo=7]
 * Header: AccountKey: [process.env.LTA_ACCOUNT_KEY]
 *
 * Parameters:
 * - BusStopCode (string, required): 5-digit bus stop code, e.g. "04121", "09023", "08031"
 * - ServiceNo (string, optional): specific bus route, e.g. "7", "147", "190"
 */

export default async function handler(req, res) {
  // Enable CORS for frontend clients
  if (typeof res.setHeader === 'function') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, AccountKey');
  }

  if (req.method === 'OPTIONS') {
    return typeof res.status === 'function' ? res.status(200).end() : res.end();
  }

  const query = req.query || {};
  const busStopCode = query.BusStopCode || query.busStopCode || query.bus_stop_code;
  const serviceNo = query.ServiceNo || query.serviceNo || query.service_no;

  if (!busStopCode) {
    const errorPayload = {
      error: 'BusStopCode parameter is required.',
      example: '/api/bus-arrival?BusStopCode=04121&ServiceNo=7',
    };
    if (typeof res.status === 'function') {
      return res.status(400).json(errorPayload);
    }
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(errorPayload));
  }

  const accountKey = process.env.LTA_ACCOUNT_KEY;

  // If LTA AccountKey is set, query live LTA DataMall v3 API
  if (accountKey) {
    try {
      const ltaUrl = new URL('https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival');
      ltaUrl.searchParams.set('BusStopCode', busStopCode.trim());
      if (serviceNo) {
        ltaUrl.searchParams.set('ServiceNo', serviceNo.trim());
      }

      const response = await fetch(ltaUrl.toString(), {
        method: 'GET',
        headers: {
          AccountKey: accountKey.trim(),
          accept: 'application/json',
        },
      });

      if (!response.ok) {
        const errText = await response.text();
        const errorData = {
          error: `LTA DataMall API responded with status ${response.status}`,
          details: errText,
          status: response.status,
          liveFeed: false,
        };
        if (typeof res.status === 'function') {
          return res.status(response.status).json(errorData);
        }
        res.writeHead(response.status, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(errorData));
      }

      const data = await response.json();
      const output = {
        ...data,
        source: 'lta_datamall_v3_live',
        liveFeed: true,
        cachedAt: new Date().toISOString(),
      };

      if (typeof res.status === 'function') {
        return res.status(200).json(output);
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(output));
    } catch (err) {
      console.error('Error fetching from LTA DataMall:', err);
      const errResponse = {
        error: 'Failed to contact LTA DataMall gateway',
        message: err.message,
        liveFeed: false,
      };
      if (typeof res.status === 'function') {
        return res.status(502).json(errResponse);
      }
      res.writeHead(502, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(errResponse));
    }
  }

  // Fallback simulation when LTA_ACCOUNT_KEY is not yet added in environment variables
  const now = Date.now();
  const sampleServices = ['7', '14', '65', '106', '143', '147', '174', '190'];
  const servicesToReturn = serviceNo ? [serviceNo] : sampleServices.slice(0, 5);

  const fallbackData = {
    'odata.metadata': 'https://datamall2.mytransport.sg/ltaodataservice/v3/$metadata#BusArrival',
    BusStopCode: busStopCode,
    Services: servicesToReturn.map((srv, idx) => ({
      ServiceNo: srv,
      Operator: ['7', '14', '65', '147', '174'].includes(srv) ? 'SBST' : 'SMRT',
      NextBus: {
        OriginCode: '84009',
        DestinationCode: '17009',
        EstimatedArrival: new Date(now + (idx * 120 + 45) * 1000).toISOString(),
        Latitude: '1.2995',
        Longitude: '103.8458',
        VisitNumber: '1',
        Load: idx % 3 === 0 ? 'SEA' : idx % 3 === 1 ? 'SDA' : 'LSD',
        Feature: 'WAB',
        Type: 'DD',
      },
      NextBus2: {
        OriginCode: '84009',
        DestinationCode: '17009',
        EstimatedArrival: new Date(now + (idx * 120 + 480) * 1000).toISOString(),
        Latitude: '1.3040',
        Longitude: '103.8350',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD',
      },
      NextBus3: {
        OriginCode: '84009',
        DestinationCode: '17009',
        EstimatedArrival: new Date(now + (idx * 120 + 960) * 1000).toISOString(),
        Latitude: '1.3140',
        Longitude: '103.8250',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'SD',
      },
    })),
    source: 'simulation_fallback',
    liveFeed: false,
    notice:
      'LTA_ACCOUNT_KEY is not yet configured in environment variables. Set LTA_ACCOUNT_KEY in Vercel to activate live LTA DataMall v3 telemetrics.',
  };

  if (typeof res.status === 'function') {
    return res.status(200).json(fallbackData);
  }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify(fallbackData));
}
