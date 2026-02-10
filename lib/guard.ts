export async function createApiKey(userId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/keys`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  return res.json();
}
