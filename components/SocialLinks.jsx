import { site, waLink } from "@/lib/site";

export function WaIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.6.1-.7l.4-.5c.1-.2.2-.3.3-.5v-.5L9.7 8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.9.9-1.1 2.2-.2 3.7a10 10 0 0 0 4 3.9c1.6.8 2.6.9 3.4.7.6-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2l-.2-.7Z" />
    </svg>
  );
}

function InstagramIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M14.2 8.5h2.6V5.6h-2.6c-2.1 0-3.7 1.7-3.7 3.8v1.8H8.2v2.9h2.3V21h3.1v-6.9h2.5l.4-2.9h-2.9V9.6c0-.6.4-1.1 1.1-1.1Z" />
    </svg>
  );
}

function GoogleIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M21.6 12.23c0-.74-.07-1.45-.19-2.14H12v4.05h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.89-1.74 2.99-4.3 2.99-7.43Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.61-2.34l-3.23-2.5c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.06v2.59A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.41 14c-.2-.6-.32-1.24-.32-1.9s.12-1.3.32-1.9V7.61H3.06a10 10 0 0 0 0 8.98L6.41 14Z" />
      <path fill="#EA4335" d="M12 5.88c1.46 0 2.78.5 3.81 1.49l2.86-2.86A10 10 0 0 0 3.06 7.61L6.41 10.2C7.2 7.84 9.4 5.88 12 5.88Z" />
    </svg>
  );
}

const items = [
  { href: site.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: site.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: site.google, label: "Google İşletme Profili", Icon: GoogleIcon },
  { href: waLink("Merhaba"), label: "WhatsApp", Icon: WaIcon },
];

const tones = {
  bar: "inline-flex h-7 w-7 items-center justify-center rounded-full text-fildisi/85 transition-colors hover:bg-fildisi/10 hover:text-altinacik",
  footer: "inline-flex h-9 w-9 items-center justify-center rounded-full border border-fildisi/15 bg-fildisi/[0.04] text-fildisi transition-colors hover:border-altinacik hover:bg-altinacik hover:text-camderin",
  light: "inline-flex h-9 w-9 items-center justify-center rounded-full border border-cizgi bg-kagit text-cam transition-colors hover:border-cam hover:bg-cam hover:text-fildisi",
};

export default function SocialLinks({ tone = "footer", className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {items.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className={tones[tone] || tones.footer}
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}
