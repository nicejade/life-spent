<script lang="ts">
  import type { ImpactData } from '../../helper/lifeSpent';
  import { t, formatString } from '../../helper/i18n';

  export let data: ImpactData;

  /** Show every Nth week on small screens to keep performance. */
  const DENSE_STEP = 4;
  $: totalDense = Math.ceil(data.totalWeeks / DENSE_STEP);
  $: spentDense = Math.ceil(data.weeksSpent / DENSE_STEP);
  $: ariaLabelTemplate = $t.impact.weeksWall.ariaLabel;
  $: weekRangeTemplate = $t.impact.weeksWall.weekRange;
  $: summaryTemplate = $t.impact.weeksWall.summary;
</script>

<div class="space-y-3" role="img" aria-label={formatString(ariaLabelTemplate, { spent: String(data.weeksSpent), total: String(data.totalWeeks) })}>
  <p class="text-xs uppercase tracking-[0.4em] text-neutral-500 light:text-neutral-600">
    {$t.impact.weeksWall.title}
  </p>
  <div class="flex flex-wrap gap-0.5 max-h-[280px] overflow-y-auto overflow-x-hidden">
    <!-- Dense view: one cell per DENSE_STEP weeks for performance -->
    {#each Array(totalDense) as _, i}
      {@const filled = i < spentDense}
      <div
        class="w-2 h-2 rounded-sm transition-colors duration-300 {filled
          ? 'bg-paper-100/90 light:bg-ink-950'
          : 'bg-white/5 border border-white/10 light:bg-black/5 light:border-black/10'}"
        title={formatString(weekRangeTemplate, { start: String(i * DENSE_STEP), end: String(Math.min((i + 1) * DENSE_STEP, data.totalWeeks)) })}
      />
    {/each}
  </div>
  <p class="text-[0.65rem] uppercase tracking-[0.3em] text-neutral-500 light:text-neutral-600">
    {formatString(summaryTemplate, { spent: String(data.weeksSpent), total: String(data.totalWeeks) })}
  </p>
</div>
