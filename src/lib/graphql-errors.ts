export function getResultErrorMessage(
  result: { __typename?: string; message?: string } | null | undefined,
  fallback: string,
) {
  if (result && "message" in result && result.message) {
    return result.message;
  }

  return fallback;
}
