import React from 'react';

export const BotField: React.FC = () => (
  <div className="hidden">
    <label>
      Don't fill this out if you're human: <input name="bot-field" />
    </label>
  </div>
);
