import React from 'react';

export const BotField: React.FC = () => (
  <div className="hidden">
    <label>
      Don't fill this out if you're human: <input name="bot-field" />
    </label>
  </div>
);

export function makeValidator(name: string) {
  return (value: string) => (value.length === 0 ? `${name} ist erforderlich` : undefined);
}

export function urlEncode(data: Record<string, string | number | boolean>): string {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');
}
