const rateLimitMap = new Map<string, number>();

export function rateLimit(ip: string, limit = 5) {
  const count = rateLimitMap.get(ip) ?? 0;

  if (count >= limit) return false;

  rateLimitMap.set(ip, count + 1);

  setTimeout(() => {
    rateLimitMap.delete(ip);
  }, 60_000); // reset 1 menit

  return true;
}
