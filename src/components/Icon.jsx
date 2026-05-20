import React from 'react';

const paths = {
  external: 'M7 7h10v10M17 7 7 17M5 5h6M5 5v14h14v-6',
  code: 'M9 18 3 12l6-6M15 6l6 6-6 6',
  mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
  github: 'M9 19c-4 1.5-4-2-6-2M15 22v-3.5c0-1 .2-1.6-.5-2 2.4-.3 4.9-1.2 4.9-5.4 0-1.2-.4-2.2-1.1-3 .1-.3.5-1.5-.1-3 0 0-.9-.3-3 1.1-.9-.2-1.8-.3-2.7-.3s-1.8.1-2.7.3c-2.1-1.4-3-1.1-3-1.1-.6 1.5-.2 2.7-.1 3-.7.8-1.1 1.8-1.1 3 0 4.2 2.5 5.1 4.9 5.4-.4.3-.6.9-.6 1.8V22',
  linkedin: 'M4 9h4v11H4zM6 4.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM11 9h4v1.8c.6-1.1 1.8-2 3.4-2 2.5 0 3.6 1.7 3.6 4.7V20h-4v-5.8c0-1.3-.4-2-1.4-2-1.1 0-1.6.8-1.6 2V20h-4z',
  copy: 'M8 8h11v11H8zM5 16H4V4h12v1',
  send: 'M3 11l18-8-8 18-2-7-8-3zM11 14l10-11',
  download: 'M12 3v12M7 10l5 5 5-5M5 21h14',
  soundOn: 'M4 10v4h4l5 4V6l-5 4H4zM17 9c1 1 1 5 0 6M20 7c2 2.5 2 7.5 0 10',
  soundOff: 'M4 10v4h4l5 4V6l-5 4H4zM18 10l4 4M22 10l-4 4',
};

export default function Icon({ name, size = 16, title }) {
  const path = paths[name];
  if (!path) return null;

  return (
    <svg
      aria-hidden={title ? undefined : 'true'}
      aria-label={title}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      <path d={path} />
    </svg>
  );
}
