async function checkPoints() {
  const address = document.getElementById('addressInput').value.trim();
  const resultDiv = document.getElementById('result');

  if (!address.startsWith("0x") || address.length !== 42) {
    resultDiv.innerHTML = "<p class='error'>Invalid address. Must start with '0x' and be 42 characters long.</p>";
    return;
  }

  resultDiv.textContent = "Loading...";

  try {
    const [profileRes, inviteesRes] = await Promise.all([
      fetch(`/api/check?address=${address}`),
      fetch(`/api/invitees?address=${address}&page=1&page_size=15`)
    ]);

    const profileData = await profileRes.json();
    const inviteesData = await inviteesRes.json();

    if (profileData.code !== 0 || inviteesData.code !== 0) {
      resultDiv.innerHTML = "<p class='error'>Failed to fetch data. Please try again later.</p>";
      return;
    }

    const user = profileData.data.user_info;
    const totalInvitees = inviteesData.data.total;

    resultDiv.innerHTML = `
      <p><strong>Address:</strong> ${user.Address}</p>
      <p><strong>Total Points:</strong> ${user.TotalPoints}</p>
      <p><strong>Task Points:</strong> ${user.TaskPoints}</p>
      <p><strong>Invite Points:</strong> ${user.InvitePoints}</p>
      <p><strong>Total Invitees:</strong> ${totalInvitees}</p>
      <p><strong>Is KOL:</strong> ${user.IsKol ? 'Yes' : 'No'}</p>
    `;
  } catch (err) {
    resultDiv.innerHTML = "<p class='error'>An error occurred while fetching data.</p>";
    console.error(err);
  }
}
