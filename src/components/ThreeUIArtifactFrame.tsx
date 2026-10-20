type ThreeUIArtifactFrameProps = {
  mode: "sword" | "card";
  title: string;
  className?: string;
  interactive?: boolean;
};

export default function ThreeUIArtifactFrame({
  mode,
  title,
  className = "",
  interactive = false,
}: ThreeUIArtifactFrameProps) {
  const source = mode === "sword"
    ? "/threeui-proof/sword.html"
    : `/threeui-proof/card.html${interactive ? "?portfolio=1" : ""}`;

  return (
    <iframe
      title={title}
      src={source}
      sandbox="allow-scripts"
      loading="lazy"
      scrolling="no"
      className={`block border-0 ${interactive ? "pointer-events-auto" : "pointer-events-none"} ${className}`}
    />
  );
}
