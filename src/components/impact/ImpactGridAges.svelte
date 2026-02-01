<script lang="ts">
  import type { ImpactData } from '../../lib/lifeSpent';

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
</script>

<div class="space-y-3" role="img" aria-label="年龄格子：每格一岁，已度过为斜线填充">
  <p class="text-xs uppercase tracking-[0.4em] text-slate-500">
    年龄格 · 一格一岁
  </p>
  <div class="flex flex-wrap gap-0.5 max-h-[320px] overflow-y-auto overflow-x-hidden">
    {#each cells as cell, i}
      <div
        class="rounded-sm border border-slate-600/50 transition-colors duration-300 {cell.filled
          ? 'bg-amber-500/20'
          : 'bg-slate-800/40'}"
        style="width: {cell.sizePx}px; height: {cell.sizePx}px; {cell.filled
          ? 'background-image: linear-gradient(135deg, transparent 42%, rgba(251, 191, 36, 0.6) 42%, rgba(251, 191, 36, 0.6) 58%, transparent 58%);'
          : ''}"
        title="{i} 岁"
      />
    {/each}
  </div>
  <p class="text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">
    已过 {data.gridCellsSpent} 格 / 共 {data.gridTotalCells} 格
  </p>
</div>
