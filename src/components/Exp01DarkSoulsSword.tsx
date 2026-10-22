import ThreeUIArtifactFrame from "@/components/ThreeUIArtifactFrame";

export default function Exp01DarkSoulsSword() {
  return (
    <div
      aria-label="Original ThreeUI sword and shrine"
      className="pointer-events-auto absolute right-[2%] top-[45%] z-0 h-[40vw] min-h-40 w-[22vw] min-w-[5.5rem] max-h-[20rem] max-w-[11rem] -translate-y-1/2 md:right-[5%] md:top-1/2 md:h-[clamp(20rem,40vw,30rem)] md:w-[clamp(11rem,23vw,19rem)] md:max-h-none md:max-w-none"
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
