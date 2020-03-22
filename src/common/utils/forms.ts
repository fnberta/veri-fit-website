export function makeValidator(name: string) {
  return (value: string) => (value.length === 0 ? `${name} ist erforderlich` : undefined);
}

export function urlEncode(data: Record<string, string | number | boolean>): string {
  return Object.keys(data)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');
}
