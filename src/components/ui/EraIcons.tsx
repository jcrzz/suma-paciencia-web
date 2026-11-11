type IconProps = {
  className?: string;
  title?: string;
};

export function FelixSnailIcon({ className = 'h-10 w-12', title }: IconProps) {
  return (
    <svg viewBox="0 0 64 48" className={className} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <path
        d="M5 37c2.8-4.2 8.2-6.6 14.3-6.6h16.8c3.8 0 6.8 2.2 6.8 5.2 0 2.5-2.2 4.4-5.5 4.4H17.8c-3.6 0-6.7.7-9.2 2.2-.8.5-1.8.1-2.2-.8-.3-.9 0-1.8.6-2.4Z"
        fill="#F2C6CE"
        stroke="#136847"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M42 36c4.5-.8 8.4-3.9 10.7-8" fill="none" stroke="#136847" strokeWidth="2" strokeLinecap="round" />
      <circle cx="29" cy="24" r="14" fill="#F2C6CE" stroke="#136847" strokeWidth="2" />
      <path
        d="M29 14c6.3 0 11 4.2 11 9.6 0 5.6-4.8 9.8-10.8 9.8-4.9 0-8.8-2.8-8.8-6.8 0-3.8 3.2-6.4 7.4-6.4 3.3 0 5.8 1.8 5.8 4.4 0 2.2-1.9 3.8-4.3 3.8-1.8 0-3.2-1-3.2-2.4 0-1.3 1.1-2.2 2.5-2.2"
        fill="none"
        stroke="#136847"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M17 38c-2.8-2.3-4.6-5.2-5.2-8.8" fill="none" stroke="#136847" strokeWidth="2" strokeLinecap="round" />
      <circle cx="11.4" cy="27.5" r="1.8" fill="#136847" />
      <circle cx="16.2" cy="23.3" r="1.3" fill="#136847" />
    </svg>
  );
}

export function PoleSunIcon({ className = 'h-10 w-12', title }: IconProps) {
  return (
    <svg viewBox="0 0 64 48" className={className} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <circle cx="44" cy="18" r="13" fill="#DDA43B" stroke="#141817" strokeWidth="2" />
      <path d="M9 46V7" stroke="#141817" strokeWidth="3" strokeLinecap="round" />
      <path d="M3 13h12M5 19h8" stroke="#141817" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M9 13C20 13 26 9 37 9M9 19c13 0 19 5 31 5" fill="none" stroke="#141817" strokeWidth="1.8" />
      <path d="M20 46c3.2-5.2 9-8.2 16-8.2h13" fill="none" stroke="#141817" strokeWidth="1.8" />
      <path d="M42 33c4.5 0 8.2 1.6 11 4" fill="none" stroke="#141817" strokeWidth="1.8" />
      <path d="M26 8c2-1.6 4.8-2.4 7.6-2.2M30 13c2.4-1.2 5.2-1.4 7.6-.6" fill="none" stroke="#F5F3EC" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function StencilSumaBlocks({ className = 'h-8 w-auto', title }: IconProps) {
  return (
    <svg viewBox="0 0 250 72" className={className} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <g fill="currentColor">
        <rect x="0" y="0" width="52" height="16" />
        <rect x="0" y="0" width="16" height="44" />
        <rect x="0" y="28" width="52" height="16" />
        <rect x="36" y="28" width="16" height="44" />
        <rect x="0" y="56" width="52" height="16" />
        <rect x="66" y="0" width="16" height="56" />
        <rect x="102" y="0" width="16" height="56" />
        <rect x="66" y="56" width="52" height="16" />
        <rect x="150" y="0" width="16" height="72" />
        <rect x="134" y="28" width="48" height="16" />
        <rect x="198" y="0" width="16" height="72" />
        <rect x="234" y="0" width="16" height="72" />
        <rect x="198" y="0" width="52" height="16" />
        <rect x="198" y="28" width="52" height="16" />
      </g>
    </svg>
  );
}

export function ShellIcon({ className = 'h-6 w-6', title }: IconProps) {  return (
    <svg viewBox="0 0 32 32" className={className} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <path d="M5 24c2.6-4.8 7-7.5 12.2-7.5 4.7 0 8.3 2.4 8.3 5.4 0 3.1-3.6 5.1-8.2 5.1H8.4C6.7 27 5.4 26.3 5 25.5c-.3-.5-.3-1 0-1.5Z" fill="#DDA04B" stroke="#136847" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="17.5" cy="13.5" r="8" fill="#FAF6EE" stroke="#DDA04B" strokeWidth="2" />
      <path d="M17.5 7.2c3.7 0 6.3 2.4 6.3 5.6 0 3.2-2.8 5.7-6.2 5.7-2.8 0-5-1.6-5-3.9 0-2.2 1.8-3.7 4.2-3.7 1.9 0 3.3 1 3.3 2.5 0 1.3-1.1 2.2-2.5 2.2" fill="none" stroke="#DDA04B" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M8 25.5c-1.7-1.2-2.8-2.9-3.2-4.9" fill="none" stroke="#136847" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function PothosLeaf({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M16 27c0-8 2-14 9-19-1 9-4 15-9 19Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M16 27C9 23 6 16 7 8c7 2 11 8 11 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M16 27c-1-4-3-7-6-9M16 27c1-4 3-7 6-9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function SnailTrail({ className = 'h-5 w-8' }: IconProps) {
  return (
    <svg viewBox="0 0 48 20" className={className} aria-hidden="true">
      <path d="M2 12c4-4 8 4 12 0s8 4 12 0 8 4 12 0 6 2 8-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 5" />
    </svg>
  );
}

export function InsulatorBirds({ className = 'h-8 w-full' }: IconProps) {
  return (
    <svg viewBox="0 0 240 32" className={className} aria-hidden="true" preserveAspectRatio="none">
      <path d="M0 20c34-6 53 5 83 0s48 6 74 1 50 4 83-2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M0 27c38-4 58 3 88-1s50 4 76 0 47 2 76-3" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <g fill="currentColor">
        <rect x="52" y="15" width="7" height="9" rx="1" />
        <rect x="166" y="17" width="7" height="9" rx="1" />
      </g>
      <path d="M104 8c2-2 4-2 6 0M112 6c2-2 4-2 6 0M126 10c2-1.7 4-1.7 6 0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
