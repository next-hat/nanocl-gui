// Get query as string from Next.js router
export function getQs(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value[0]
  }
  return value || undefined
}
