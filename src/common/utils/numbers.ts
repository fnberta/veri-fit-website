export function range(start: number, length: number): number[] {
  const result = [];
  for (let i = start; i < length; i++) {
    result.push(i);
  }

  return result;
}
