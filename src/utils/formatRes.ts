export default async function formatRes(promise: Promise<any>) {
  const res: [any, any] = [null, null];

  try {
    const resolved = await promise;
    res[0] = resolved;
  } catch (err) {
    res[1] = err;
  }

  return res;
}
