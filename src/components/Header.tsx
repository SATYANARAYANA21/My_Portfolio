export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference">
      <nav className="wrap flex items-center justify-between py-5 text-paper">
        <a
          href="#top"
          className="flex items-center gap-2 font-display text-step-1 uppercase tracking-tighter2"
        >
          SATYA
          <span className="font-jp text-step--1 text-accent">框</span>
        </a>
        <button className="font-mono text-[11px] uppercase tracking-ultrawide transition-opacity hover:opacity-60">
          Say Hello ↗
        </button>
      </nav>
    </header>
  );
}
