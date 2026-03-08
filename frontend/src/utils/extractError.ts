export const extractError = (error: unknown): string => {
  if (error && typeof error === 'object' && 'errorMessage' in error) {
    const msg = (error as { errorMessage: string | string[] }).errorMessage;
    return Array.isArray(msg) ? msg.join(', ') : msg;
  }
  return error instanceof Error ? error.message : 'Something went wrong';
};
