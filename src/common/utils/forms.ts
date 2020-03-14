export function makeValidator(name: string) {
  return (value: string) => (value.length === 0 ? `${name} ist erforderlich` : undefined);
}
