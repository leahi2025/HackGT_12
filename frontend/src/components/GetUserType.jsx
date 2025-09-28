export async function getUserType(token, userId) {
  
  try {
    const res = await fetch(`http://localhost:3000/patients/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      // If response is 404 (not found), treat as HCP
      console.log("Response not ok:", res.status);
      if (res.status === 404) return "hcp";
      // Other errors
      console.error("Error fetching patient:", await res.text());
      return null;
    }

    const data = await res.json();
    // If patient exists, return "patient", otherwise treat as HCP
    return data ? "patient" : "hcp";
  } catch (err) {
    console.error("Error in getUserType:", err);
    return null;
  }

}
