<script lang="ts">
  import type { LifeCalculation } from '../lib/types';
  import { formatAge, formatDate } from '../lib/lifePercent';

  export let result: LifeCalculation;
  export let onReset: () => void;

  $: percentDisplay = result.percentSpent.toFixed(2);
</script>

<div class="glass-card rounded-2xl p-8 md:p-12 max-w-2xl w-full">
  <div class="text-center mb-8">
    <h2 class="text-5xl md:text-7xl font-light text-amber-400 mb-4 tracking-tight">
      {percentDisplay}%
    </h2>
    <p class="text-lg md:text-xl text-slate-300 font-light">
      已度过
    </p>
  </div>

  <div class="space-y-4 mb-8">
    <div class="flex justify-between items-center py-3 border-b border-slate-800/50">
      <span class="text-slate-400">出生日期</span>
      <span class="text-slate-200 font-medium">{formatDate(result.birthDate)}</span>
    </div>
    
    <div class="flex justify-between items-center py-3 border-b border-slate-800/50">
      <span class="text-slate-400">当前年龄</span>
      <span class="text-slate-200 font-medium">{formatAge(result.currentAge)}</span>
    </div>
    
    <div class="flex justify-between items-center py-3 border-b border-slate-800/50">
      <span class="text-slate-400">参考中位寿命</span>
      <span class="text-slate-200 font-medium">{result.medianAge} 岁</span>
    </div>

    <div class="flex justify-between items-center py-3">
      <span class="text-slate-400">预计剩余</span>
      <span class="text-slate-200 font-medium">{formatAge(result.yearsRemaining)}</span>
    </div>
  </div>

  <div class="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
    <p class="text-sm text-slate-300 leading-relaxed">
      中位寿命不是终点，而是统计参考。<br />
      正视剩余时间，让每一天都有意义。
    </p>
  </div>

  <button
    on:click={onReset}
    class="w-full px-6 py-3 bg-slate-950/50 hover:bg-slate-900/50 
           border border-slate-700 hover:border-slate-600
           text-slate-300 rounded-xl transition-all cursor-pointer"
    aria-label="重新计算"
  >
    重新计算
  </button>
</div>
