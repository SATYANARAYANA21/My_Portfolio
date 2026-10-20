import ThreeUIArtifactFrame from "@/components/ThreeUIArtifactFrame";

export default function Exp02AshenOneCard() {
  return (
    <div
      aria-label="Original ThreeUI Ashen One card"
      className="relative mx-auto mt-8 h-[clamp(24rem,105vw,32rem)] w-[min(86vw,24rem)] overflow-hidden bg-black lg:absolute lg:left-[62%] lg:top-0 lg:z-[5] lg:mx-0 lg:mt-0 lg:h-auto lg:w-[clamp(22rem,31vw,28rem)] lg:aspect-[0.72]"
    >
      <ThreeUIArtifactFrame
        mode="card"
        title="Original ThreeUI Ashen One card"
        interactive
        className="absolute left-1/2 top-1/2 h-[108%] w-[108%] -translate-x-1/2 -translate-y-1/2 bg-black"
      />
    </div>
  );
}
