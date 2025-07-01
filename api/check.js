export default async function handler(req, res) {
  const { address } = req.query;
  if (!address || !address.startsWith('0x') || address.length !== 42) {
    res.status(400).json({ code: 1, msg: 'Invalid address' });
    return;
  }

  try {
    const token = process.env.PHAROS_BEARER_TOKEN;
    const apiRes = await fetch(`https://api.pharosnetwork.xyz/user/profile?address=${address}`, {
      headers: {
        Authorization: `Bearer ${token}`,export default async function handler(req, res) {
  const jwt = process.env.PHAROS_BEARER_TOKEN;

  try {
    const apiRes = await fetch("https://api.pharosnetwork.xyz/user/profile", {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Referer: 'https://testnet.pharosnetwork.xyz', // HARUS sesuai!
      }
    });

    const json = await apiRes.json();

    if (!json?.data) {
      return res.status(401).json({ code: 1, msg: 'JWT salah atau tidak ada data', raw: json });
    }

    const { address, level, points, nickname, invite_code } = json.data;

    return res.status(200).json({ address, level, points, nickname, invite_code });

  } catch (err) {
    return res.status(500).json({ code: 1, msg: 'Gagal mengambil data', error: err.message });
  }
}

        Referer: 'https://testnet.pharosnetwork.xyz',
      },
    });
    const data = await apiRes.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ code: 1, msg: 'Failed to fetch data' });
  }
}
