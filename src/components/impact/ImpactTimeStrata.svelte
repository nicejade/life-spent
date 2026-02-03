<script lang="ts">
  import type { ImpactData } from '../../helper/lifeSpent';

  export let data: ImpactData;
</script>

<div class="space-y-3" role="img" aria-label="时间层：按年代划分，已度过层为深色">
  <p class="text-xs uppercase tracking-[0.4em] text-neutral-500 light:text-neutral-600">
    时间层 · 已走过的年代
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
          {layer.spent ? '已过' : '未至'}
        </span>
      </div>
    {/each}
  </div>
  <p class="text-[0.65rem] uppercase tracking-[0.3em] text-neutral-500 light:text-neutral-600">
    每一层都是一道门槛；越过即不再回头。
  </p>
</div>
