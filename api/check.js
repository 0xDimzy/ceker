export default async function handler(req, res) {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ error: 'No address provided' });
  }

  const BEARER_TOKEN = process.env.PHAROS_BEARER_TOKEN;

  try {
    const response = await fetch(`https://api.pharosnetwork.xyz/user/profile?address=${address}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Referer': 'https://testnet.pharosnetwork.xyz',
        'Origin': 'https://testnet.pharosnetwork.xyz',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0',
      }
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
