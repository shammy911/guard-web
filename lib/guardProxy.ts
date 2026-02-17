export function masterKeyHeader() {
  const master = process.env.MASTER_KEY;
  if (!master) throw new Error("MASTER_KEY missing");
  return master;
}
