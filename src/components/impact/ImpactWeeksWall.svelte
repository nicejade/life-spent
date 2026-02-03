<script lang="ts">
  import type { ImpactData } from '../../helper/lifeSpent';

  export let data: ImpactData;

  /** Show every Nth week on small screens to keep performance. */
  const DENSE_STEP = 4;
  $: totalDense = Math.ceil(data.totalWeeks / DENSE_STEP);
  $: spentDense = Math.ceil(data.weeksSpent / DENSE_STEP);
</script>

<div class="space-y-3" role="img" aria-label="生命周历：已度过 {data.weeksSpent} 周，共 {data.totalWeeks} 周">
  <p class="text-xs uppercase tracking-[0.4em] text-slate-500">
    周历墙 · 每一格是一周
  </p>
  <div class="flex flex-wrap gap-0.5 max-h-[280px] overflow-y-auto overflow-x-hidden">
    <!-- Dense view: one cell per DENSE_STEP weeks for performance -->
    {#each Array(totalDense) as _, i}
      {@const filled = i < spentDense}
      <div
        class="w-2 h-2 rounded-sm transition-colors duration-300 {filled
          ? 'bg-amber-400/90'
          : 'bg-slate-700/60 border border-slate-600/50'}"
        title="{i * DENSE_STEP}–{Math.min((i + 1) * DENSE_STEP, data.totalWeeks)} 周"
      />
    {/each}
  </div>
  <p class="text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">
    已过 {data.weeksSpent} 周 / 共 {data.totalWeeks} 周（以中位寿命计）
  </p>
</div>
