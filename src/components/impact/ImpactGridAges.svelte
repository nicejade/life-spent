<script lang="ts">
  import type { ImpactData } from '../../helper/lifeSpent';
  import { t, formatString } from '../../helper/i18n';

  export let data: ImpactData;

  /** Build flat list of cells: { sizePx, filled } for each year from bands. */
  $: cells = (() => {
    const out: { sizePx: number; filled: boolean }[] = [];
    let year = 0;
    for (const band of data.gridBands) {
      for (let i = 0; i < band.cellsTotal; i++) {
        const filled = year < data.gridCellsSpent;
        out.push({ sizePx: band.sizePx, filled });
        year += 1;
      }
    }
    return out;
  })();
  $: ageLabelTemplate = $t.impact.gridAges.ageLabel;
  $: summaryTemplate = $t.impact.gridAges.summary;
</script>

<div class="space-y-3" role="img" aria-label={$t.impact.gridAges.ariaLabel}>
  <p class="text-xs uppercase tracking-[0.4em] text-neutral-500 light:text-neutral-600">
    {$t.impact.gridAges.title}
  </p>
  <div class="flex flex-wrap gap-0.5 max-h-[320px] overflow-y-auto overflow-x-hidden">
    {#each cells as cell, i}
      <div
        class="rounded-sm border border-white/10 light:border-black/10 transition-colors duration-300 {cell.filled
          ? 'bg-white/10 light:bg-ink-950'
          : 'bg-white/5 light:bg-black/5'}"
        style="width: {cell.sizePx}px; height: {cell.sizePx}px; {cell.filled
          ? 'background-image: linear-gradient(135deg, transparent 42%, rgba(255, 255, 255, 0.45) 42%, rgba(255, 255, 255, 0.45) 58%, transparent 58%);'
          : ''}"
        title={formatString(ageLabelTemplate, { age: String(i) })}
      />
    {/each}
  </div>
  <p class="text-[0.65rem] uppercase tracking-[0.3em] text-neutral-500 light:text-neutral-600">
    {formatString(summaryTemplate, { spent: String(data.gridCellsSpent), total: String(data.gridTotalCells) })}
  </p>
</div>
