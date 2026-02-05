<script lang="ts">
  import type { ImpactData } from '../../helper/lifeSpent';
  import { t } from '../../helper/i18n';

  export let data: ImpactData;
</script>

<div class="space-y-3" role="img" aria-label={$t.impact.strata.ariaLabel}>
  <p class="text-xs uppercase tracking-[0.4em] text-neutral-500 light:text-neutral-600">
    {$t.impact.strata.title}
  </p>
  <div class="space-y-2">
    {#each data.strata as layer}
      <div
        class="flex items-center justify-between rounded-lg border transition-colors duration-300 {layer.spent
          ? 'bg-white/5 border-white/10 text-neutral-400 light:bg-black/5 light:border-black/10 light:text-neutral-600'
          : 'bg-white/10 border-white/20 text-paper-50 light:bg-black/10 light:border-black/20 light:text-ink-950'}"
      >
        <span class="px-4 py-3 text-sm font-medium">{layer.label}</span>
        <span class="px-4 py-3 text-xs uppercase tracking-wider">
          {layer.spent ? $t.impact.strata.passed : $t.impact.strata.notYet}
        </span>
      </div>
    {/each}
  </div>
  <p class="text-[0.65rem] uppercase tracking-[0.3em] text-neutral-500 light:text-neutral-600">
    {$t.impact.strata.conclusion}
  </p>
</div>
