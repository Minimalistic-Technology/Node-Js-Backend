export function success(payload: any, message = "OK", meta?: any) {
  const res: any = { success: true, message, data: payload ?? null };
  if (meta) res.meta = meta;
  return res;
}

export function error(message = "Error", code = 500, details?: any) {
  return { success: false, message, code, details: details ?? null };
}
