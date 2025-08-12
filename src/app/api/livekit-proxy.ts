import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Construct the URL you want to proxy to, including query params
    const url = new URL('https://livekit.promise-pool.com/rtc/validate');

    // Forward query parameters from client request
    Object.entries(req.query).forEach(([key, value]) => {
      if (typeof value === 'string') {
        url.searchParams.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((v) => url.searchParams.append(key, v));
      }
    });

    // Forward the request to LiveKit server
    const livekitRes = await fetch(url.toString(), {
      method: req.method,
      headers: {
        // Copy relevant headers (optional, depends on your use case)
        // You might want to forward auth headers here if any
        // 'Authorization': req.headers.authorization || '',
      },
      // If it's a POST/PUT request, forward body as well
      body: req.method === 'GET' ? undefined : req.body,
    });

    // Get the LiveKit response body
    const data = await livekitRes.text();

    // Set the response headers you want to forward (like content-type)
    res.setHeader('Content-Type', livekitRes.headers.get('Content-Type') || 'application/json');

    // Return the response from LiveKit server to client
    res.status(livekitRes.status).send(data);
  } catch (error) {
    console.error('LiveKit proxy error:', error);
    res.status(500).json({ error: 'Proxy error' });
  }
}
