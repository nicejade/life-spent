<script lang="ts">
  import type { LifeCalculation } from '../../types/main';
  import type { ImpactData } from '../../helper/lifeSpent';
  import { t, formatString } from '../../helper/i18n';

  export let result: LifeCalculation;
  export let data: ImpactData;

  $: maxThreshold = Math.max(...data.thresholds.map((t) => t.age), result.lifeExpectancy);
  $: cursorPercent = (result.currentAge / maxThreshold) * 100;
  $: ageLabelTemplate = $t.impact.heartbeat.ageLabel;
  $: currentAgeLabelTemplate = $t.impact.heartbeat.currentAgeLabel;
</script>

<div class="space-y-3" role="img" aria-label={$t.impact.heartbeat.ariaLabel}>
  <p class="text-xs uppercase tracking-[0.4em] text-neutral-500 light:text-neutral-600">
    {$t.impact.heartbeat.title}
  </p>
  <div class="relative w-full h-12 rounded-xl bg-white/5 border border-white/10 overflow-hidden light:bg-black/5 light:border-black/10">
    <!-- Threshold ticks -->
    {#each data.thresholds as t}
      <div
        class="absolute top-0 bottom-0 w-px transition-colors duration-300 {t.passed ? 'bg-paper-100/70 light:bg-ink-950' : 'bg-white/20 light:bg-black/20'}"
        style="left: {(t.age / maxThreshold) * 100}%"
        title={formatString(ageLabelTemplate, { age: String(t.age) })}
      />
    {/each}
    <!-- Current age cursor -->
    <div
      class="absolute top-0 bottom-0 w-1 bg-paper-100 rounded-full shadow-lg shadow-white/20 transition-[left] duration-500 ease-out light:bg-ink-950 light:shadow-black/20"
      style="left: {Math.min(cursorPercent, 100)}%"
      title={formatString(currentAgeLabelTemplate, { age: result.currentAge.toFixed(1) })}
    />
  </div>
  <div class="relative w-full min-h-[1.25rem] text-[0.65rem] uppercase tracking-[0.25em] text-neutral-500 light:text-neutral-600">
    {#each data.thresholds as t}
      <span
        class="absolute -translate-x-1/2 whitespace-nowrap {t.passed ? 'text-paper-100/80 light:text-ink-950' : ''}"
        style="left: {(t.age / maxThreshold) * 100}%"
      >
        {t.age}
      </span>
    {/each}
  </div>
  <p class="text-[0.65rem] uppercase tracking-[0.3em] text-neutral-500 light:text-neutral-600">
    {$t.impact.heartbeat.conclusion}
  </p>
</div>
