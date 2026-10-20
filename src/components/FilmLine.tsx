/**
 * FilmLine — horizontal film-strip divider that separates sections.
 *
 * Reference DOM:
 * <div aria-hidden="true" data-snap="true"
 *      class="film-line relative w-full select-none py-3.5">
 *   <div class="wrap flex items-center justify-between gap-4">
 *     <span class="rebate">▶ ATELIER 400</span>
 *     <span class="flex items-center gap-3">
 *       <span class="h-px w-6 bg-[rgb(var(--film-edge)/0.28)] sm:w-10"></span>
 *       <span class="rebate rebate-hi tabular-nums">01</span>
 *       <span class="font-jp text-[0.8rem] leading-none text-accent">間</span>
 *       <span class="h-px w-6 bg-[rgb(var(--film-edge)/0.28)] sm:w-10"></span>
 *     </span>
 *     <span class="rebate hidden sm:inline">R-0142 ▶</span>
 *     <span class="rebate sm:hidden">▶</span>
 *   </div>
 * </div>
 */

interface FilmLineProps {
  /** Zero-padded two-digit exposure number, e.g. "01" */
  exposure: string;
  /** Single kanji character for this exposure */
  kanji: string;
}

export default function FilmLine({ exposure, kanji }: FilmLineProps) {
  return (
    <div aria-hidden="true" data-snap="true" className="film-line relative w-full select-none py-3.5">
      <div className="wrap flex items-center justify-between gap-4">
        {/* Left rebate label */}
        <span className="rebate">▶ SATYA 400</span>

        {/* Centre: lines + frame counter + kanji */}
        <span className="flex items-center gap-3">
          <span
            className="h-px w-6 sm:w-10"
            style={{ background: "rgb(var(--film-edge) / 0.28)" }}
          />
          <span className="rebate rebate-hi tabular-nums">{exposure}</span>
          <span className="font-jp text-[0.8rem] leading-none text-accent">{kanji}</span>
          <span
            className="h-px w-6 sm:w-10"
            style={{ background: "rgb(var(--film-edge) / 0.28)" }}
          />
        </span>

        {/* Right rebate label */}
        <span className="rebate hidden sm:inline">R-0142 ▶</span>
        <span className="rebate sm:hidden">▶</span>
      </div>
    </div>
  );
}
