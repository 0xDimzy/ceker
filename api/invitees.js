export default async function handler(req, res) {
  const { address, page = '1', page_size = '15' } = req.query;
  if (!address || !address.startsWith('0x') || address.length !== 42) {
    res.status(400).json({ code: 1, msg: 'Invalid address' });
    return;
  }

  try {
    const token = process.env.PHAROS_BEARER_TOKEN;
    const apiRes = await fetch(`https://api.pharosnetwork.xyz/user/invitees?address=${address}&page=${page}&page_size=${page_size}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Referer: 'https://testnet.pharosnetwork.xyz',
      },
    });
    const data = await apiRes.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ code: 1, msg: 'Failed to fetch data' });
  }
}
