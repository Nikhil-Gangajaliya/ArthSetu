export const loginUser = async (userData) => {
  const res = await fetch("http://localhost:7500/api/v1/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
};