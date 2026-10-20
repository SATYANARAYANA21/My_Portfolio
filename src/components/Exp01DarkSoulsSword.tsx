import ThreeUIArtifactFrame from "@/components/ThreeUIArtifactFrame";

export default function Exp01DarkSoulsSword() {
  return (
    <div
      aria-label="Original ThreeUI sword and shrine"
      className="pointer-events-auto absolute right-[5%] top-1/2 z-0 hidden -translate-y-1/2 md:block"
      style={{ width: "clamp(11rem, 23vw, 19rem)", height: "clamp(20rem, 40vw, 30rem)" }}
    >
      <ThreeUIArtifactFrame
        mode="sword"
        title="Original ThreeUI sword and shrine"
        interactive
        className="h-full w-full bg-transparent"
      />
    </div>
  );
}
