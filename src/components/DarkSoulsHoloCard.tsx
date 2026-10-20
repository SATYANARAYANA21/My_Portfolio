import { useState, type CSSProperties } from "react";

export type DarkSoulsHoloCardProps = {
  className?: string;
  style?: CSSProperties;
};

export function DarkSoulsHoloCard({ className = "", style }: DarkSoulsHoloCardProps) {
  const [ready, setReady] = useState(false);

  return (
    <div
      className={`threeui-background dark-souls-holo-card${className ? ` ${className}` : ""}`}
      role="group"
      aria-label="Interactive Dark Souls holographic card"
      data-state={ready ? "ready" : "loading"}
      style={{
        position: "relative",
        overflow: "hidden",
        background: "transparent",
        pointerEvents: "auto",
        ...style,
      }}
    >
      <iframe
        title="Dark Souls Holo Card — The Ashen One"
        src="/landing-pages/dark-souls-holo-card.html"
        sandbox="allow-scripts"
        loading="lazy"
        onLoad={() => setReady(true)}
        style={{
          position: "absolute",
          inset: 0,
          display: "block",
          width: "100%",
          height: "100%",
          border: 0,
          background: "transparent",
          opacity: ready ? 1 : 0,
          pointerEvents: ready ? "auto" : "none",
          transition: "opacity 240ms ease-out",
        }}
      />
    </div>
  );
}
