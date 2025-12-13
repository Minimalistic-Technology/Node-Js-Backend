export function parsePagination(qs: any) {
  const page = Math.max(1, parseInt(qs.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(qs.limit as string) || 25));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function buildSort(sortBy?: string, order?: string) {
  if (!sortBy) return { createdAt: -1 };
  const dir = order === "asc" ? 1 : -1;
  return { [sortBy]: dir };
}
