<script lang="ts">
  import type { LifeCalculation } from '../../types/main';
  import type { ImpactData } from '../../helper/lifeSpent';

  export let result: LifeCalculation;
  export let data: ImpactData;

  $: maxThreshold = Math.max(...data.thresholds.map((t) => t.age), result.medianAge);
  $: cursorPercent = (result.currentAge / maxThreshold) * 100;
</script>

<div class="space-y-3" role="img" aria-label="节拍刻度：关键年龄 18、30、35、40、50、60 岁，当前年龄位置">
  <p class="text-xs uppercase tracking-[0.4em] text-slate-500">
    节拍刻度 · 关键年龄门槛
  </p>
  <div class="relative w-full h-12 rounded-xl bg-slate-800/50 border border-slate-700 overflow-hidden">
    <!-- Threshold ticks -->
    {#each data.thresholds as t}
      <div
        class="absolute top-0 bottom-0 w-px transition-colors duration-300 {t.passed ? 'bg-amber-400/70' : 'bg-slate-600'}"
        style="left: {(t.age / maxThreshold) * 100}%"
        title="{t.age} 岁"
      />
    {/each}
    <!-- Current age cursor -->
    <div
      class="absolute top-0 bottom-0 w-1 bg-amber-400 rounded-full shadow-lg shadow-amber-400/30 transition-[left] duration-500 ease-out"
      style="left: {Math.min(cursorPercent, 100)}%"
      title="当前约 {result.currentAge.toFixed(1)} 岁"
    />
  </div>
  <div class="relative w-full min-h-[1.25rem] text-[0.65rem] uppercase tracking-[0.25em] text-slate-500">
    {#each data.thresholds as t}
      <span
        class="absolute -translate-x-1/2 whitespace-nowrap {t.passed ? 'text-amber-400/80' : ''}"
        style="left: {(t.age / maxThreshold) * 100}%"
      >
        {t.age}
      </span>
    {/each}
  </div>
  <p class="text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">
    每道线都是一个「不再年轻」的节点；你已在其中一侧。
  </p>
</div>
