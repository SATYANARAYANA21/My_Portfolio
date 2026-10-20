'use client';

import dynamic from 'next/dynamic';

const Exp07FieldNote = dynamic(() => import('./Exp07FieldNote'), {
  ssr: false,
  loading: () => <div aria-hidden="true" className="h-full w-full bg-[#f3e8e1]" />,
});

export default function Reel() {
  return (
    <section
      id="reel"
      aria-label="EXP07 — Satya’s personal field note"
      className="relative h-screen w-full overflow-hidden bg-[#f3e8e1]"
      style={{ height: '100dvh' }}
    >
      <Exp07FieldNote />
    </section>
  );
}
