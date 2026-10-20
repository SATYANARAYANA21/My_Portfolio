import ThreeUIArtifactFrame from "@/components/ThreeUIArtifactFrame";

export default function ThreeUIProofPage() {
  return (
    <main className="min-h-screen bg-neutral-100 px-5 py-8 text-neutral-900 sm:px-8">
      <h1 className="mb-6 font-mono text-sm uppercase tracking-widest">
        ThreeUI source isolation proof
      </h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="min-w-0">
          <h2 className="mb-2 font-mono text-xs uppercase tracking-wider">
            Original sword / shrine renderer
          </h2>
          <ThreeUIArtifactFrame
            mode="sword"
            title="Isolated original ThreeUI sword and shrine renderer"
            className="aspect-[4/3] w-full border border-neutral-300 bg-neutral-200"
          />
        </section>

        <section className="min-w-0">
          <h2 className="mb-2 font-mono text-xs uppercase tracking-wider">
            Original Ashen One card renderer
          </h2>
          <ThreeUIArtifactFrame
            mode="card"
            title="Isolated original ThreeUI Ashen One card renderer"
            className="aspect-[4/3] w-full border border-neutral-300 bg-neutral-200"
          />
        </section>
      </div>

      <p className="mt-4 max-w-prose text-xs text-neutral-600">
        Each panel runs in its own sandboxed document and WebGL renderer. These
        temporary proof renderers do not mount in the portfolio sections.
      </p>
    </main>
  );
}
