export function masterKeyHeader() {
  const master = process.env.GUARD_MASTER_KEY;
  if (!master) throw new Error("MASTER_KEY missing");
  return master;
}
