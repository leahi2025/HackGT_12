export async function getUserType(token, userId) {
  // Check patients table
  let res = await fetch(`http://localhost:3000/patients/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.ok) {
    return "patient";
  }

  // Check hcp table
  res = await fetch(`http://localhost:3000/hcp/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.ok) {
    return "hcp";
  }

  return null; // not found
}
