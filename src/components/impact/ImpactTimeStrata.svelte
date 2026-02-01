<script lang="ts">
  import type { ImpactData } from '../../lib/lifeSpent';

  export let data: ImpactData;
</script>

<div class="space-y-3" role="img" aria-label="时间层：按年代划分，已度过层为深色">
  <p class="text-xs uppercase tracking-[0.4em] text-slate-500">
    时间层 · 已走过的年代
  </p>
  <div class="space-y-2">
    {#each data.strata as layer}
      <div
        class="flex items-center justify-between rounded-lg border transition-colors duration-300 {layer.spent
          ? 'bg-slate-800/80 border-slate-600 text-slate-400'
          : 'bg-slate-800/30 border-slate-700 text-slate-200'}"
      >
        <span class="px-4 py-3 text-sm font-medium">{layer.label}</span>
        <span class="px-4 py-3 text-xs uppercase tracking-wider">
          {layer.spent ? '已过' : '未至'}
        </span>
      </div>
    {/each}
  </div>
  <p class="text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">
    每一层都是一道门槛；越过即不再回头。
  </p>
</div>
