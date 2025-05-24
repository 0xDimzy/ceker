import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { address, page = 1, page_size = 15 } = req.query;

  if (!address || !address.startsWith('0x') || address.length !== 42) {
    return res.status(400).json({ code: 1, msg: 'Invalid address' });
  }

  const token = process.env.PHAROS_BEARER_TOKEN;
  if (!token) {
    return res.status(500).json({ code: 1, msg: 'Server token not configured' });
  }

  const apiUrl = `https://api.pharosnetwork.xyz/user/invitees?address=${address}&page=${page}&page_size=${page_size}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Referer: 'https://testnet.pharosnetwork.xyz'
      }
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ code: 1, msg: `API error: ${text}` });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Error fetching invitees:', error);
    return res.status(500).json({ code: 1, msg: 'Internal server error' });
  }
}
