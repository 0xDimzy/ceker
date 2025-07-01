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
  <div class="result-row">
    <div class="result-label">Address</div>
    <div class="result-value short-address">${shortenAddress(user.Address)}</div>
  </div>
  </div>
  <div class="result-row">
    <div class="result-label">Total Points</div>
    <div class="result-value">${user.TotalPoints}</div>
  </div>
  <div class="result-row">
    <div class="result-label">Task Points</div>
    <div class="result-value">${user.TaskPoints}</div>
  </div>
  <div class="result-row">
    <div class="result-label">Invite Points</div>
    <div class="result-value">${user.InvitePoints}</div>
  </div>
  <div class="result-row">
    <div class="result-label">Total Invitees</div>
    <div class="result-value">${totalInvitees}</div>
  </div>
  <div class="result-row">
  <div class="result-label">Completed Tasks</div>
  <div class="result-value">
    <div class="task-wrapper">
      <ul class="task-list">${taskListHtml}</ul>
    </div>
  </div>
</div>
`;
  } catch (err) {
    resultDiv.innerHTML = "<p class='error'>An error occurred while fetching data.</p>";
    console.error(err);
  }
}
