function shortenAddress(address) {
  if (!address || address.length < 10) return address;
  return address.slice(0, 6) + '...' + address.slice(-4);
}

async function checkPoints() {
  const address = document.getElementById('addressInput').value.trim();
  const resultDiv = document.getElementById('result');

  if (!address.startsWith("0x") || address.length !== 42) {
    resultDiv.innerHTML = "<p class='error'>Invalid address. Make sure it starts with '0x' and is 42 characters long.</p>";
    return;
  }

  resultDiv.textContent = "Loading...";

  try {
    const profileRes = await fetch(`/api/check?address=${address}`);
    const profileData = await profileRes.json();

    const inviteesRes = await fetch(`/api/invitees?address=${address}`);
    const inviteesData = await inviteesRes.json();

    const tasksRes = await fetch(`/api/tasks?address=${address}`);
    const tasksData = await tasksRes.json();

    if (profileData.code !== 0 || inviteesData.code !== 0 || tasksData.code !== 0) {
      resultDiv.innerHTML = "<p class='error'>Failed to fetch data. Please try again later.</p>";
      return;
    }

    const user = profileData.data.user_info;
    const totalInvitees = inviteesData.data.total;
    const tasks = tasksData.data.user_tasks;

    const taskListHtml = tasks.map(task => {
      return `<li>${task.TaskName} : ${task.CompleteTimes} times</li>`;
    }).join("");

    resultDiv.innerHTML = `
      <p><b>Address:</b> <span class="short-address">${shortenAddress(user.Address)}</span></p>
      <p><b>Total Points:</b> ${user.TotalPoints}</p>
      <p><b>Task Points:</b> ${user.TaskPoints}</p>
      <p><b>Invite Points:</b> ${user.InvitePoints}</p>
      <p><b>Total Invitees:</b> ${totalInvitees}</p>
      <p><b>Completed Tasks:</b></p>
      <ul>${taskListHtml}</ul>
    `;
  } catch (err) {
    resultDiv.innerHTML = "<p class='error'>An error occurred while fetching data.</p>";
    console.error(err);
  }
}
