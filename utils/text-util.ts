export const comment = (content: string, length: number = 50) => {
  const hyphens = (length - content.length) / 2;
  if (hyphens <= 0) {
    return `/* ${content} */`
  }

  return `/* ${"".padStart(hyphens, '-')} ${content} ${"".padEnd(hyphens, '-')} */`
}