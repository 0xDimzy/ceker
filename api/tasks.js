export default async function handler(req, res) {
  const { address } = req.query;

  if (!address || !address.startsWith('0x') || address.length !== 42) {
    res.status(400).json({ code: 1, msg: 'Invalid address' });
    return;
  }

  try {
    const token = process.env.PHAROS_BEARER_TOKEN;

    const apiRes = await fetch(`https://api.pharosnetwork.xyz/user/tasks?address=${address}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Referer: 'https://testnet.pharosnetwork.xyz',
      },
    });

    if (!apiRes.ok) {
      res.status(apiRes.status).json({ code: 1, msg: 'Failed to fetch tasks data' });
      return;
    }

    const data = await apiRes.json();

    // Mapping nama TaskId
    const taskNames = {
      101: 'Zenith Swaps',
      102: 'Zenith LPs',
      103: 'Token Transfer',
      104: 'Pharos Domain',      // Tambahan
      105: 'NFT Badge',          // Tambahan
      106: 'Faroswap Swaps',     // Tambahan
      107: 'Faroswap LPs',       // Tambahan
    };

    // Filter & mapping hasil
    const filteredTasks = data.data.user_tasks
      .filter(task => [101, 102, 103, 104, 105, 106, 107].includes(task.TaskId)) // Update filter
      .map(task => ({
        ...task,
        TaskName: taskNames[task.TaskId] || `Task ${task.TaskId}`,
      }));

    res.status(200).json({
      code: 0,
      data: {
        user_tasks: filteredTasks,
      },
      msg: 'ok',
    });

  } catch (error) {
    res.status(500).json({ code: 1, msg: 'Internal server error' });
  }
}
