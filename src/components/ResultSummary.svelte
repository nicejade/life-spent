<script lang="ts">
  import type { LifeCalculation } from '../lib/types';
  import { formatAge, formatDate } from '../lib/lifePercent';

  export let result: LifeCalculation;
  export let onReset: () => void;

  $: percentDisplay = result.percentSpent.toFixed(2);
  $: filledPercent = Math.min(Math.max(result.percentSpent, 0), 100);
  $: remainingPercent = Math.max(100 - result.percentSpent, 0).toFixed(2);
</script>

<div class="glass-card rounded-2xl p-8 md:p-12 max-w-2xl w-full space-y-8">
  <div class="text-center space-y-2">
    <h2 class="text-5xl md:text-7xl font-light text-amber-400 tracking-tight">
      {percentDisplay}%
    </h2>
    <p class="text-lg md:text-xl text-slate-300 font-light">
      已度过
    </p>
    <div class="space-y-1">
      <div class="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
        <div
          class="h-full rounded-full bg-amber-400 transition-[width] duration-500 ease-out"
          style={`width:${filledPercent}%`}
          role="presentation"
        />
      </div>
      <p class="text-[0.65rem] uppercase tracking-[0.4em] text-slate-500">
        余下 {remainingPercent}% · 参考中位寿命是统计
      </p>
    </div>
  </div>

  <dl class="grid grid-cols-2 gap-x-6 gap-y-4 text-sm md:text-base text-slate-300">
    <div class="flex flex-col">
      <dt class="text-xs text-slate-500 uppercase tracking-[0.3em]">出生日期</dt>
      <dd class="font-medium text-slate-100">{formatDate(result.birthDate)}</dd>
    </div>
    <div class="flex flex-col">
      <dt class="text-xs text-slate-500 uppercase tracking-[0.3em]">当前年龄</dt>
      <dd class="font-medium text-slate-100">{formatAge(result.currentAge)}</dd>
    </div>
    <div class="flex flex-col">
      <dt class="text-xs text-slate-500 uppercase tracking-[0.3em]">参考中位寿命</dt>
      <dd class="font-medium text-slate-100">{result.medianAge} 岁</dd>
    </div>
    <div class="flex flex-col">
      <dt class="text-xs text-slate-500 uppercase tracking-[0.3em]">预计剩余</dt>
      <dd class="font-medium text-slate-100">{formatAge(result.yearsRemaining)}</dd>
    </div>
  </dl>

  <div class="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-sm text-slate-300 leading-relaxed">
    中位寿命不是终点，而是参考值。正视剩余时间，让每天都更清醒。
  </div>

  <button
    on:click={onReset}
    class="w-full px-6 py-3 bg-slate-950/50 hover:bg-slate-900/50 border border-slate-700 hover:border-slate-600
           text-slate-300 rounded-xl transition-all cursor-pointer"
    aria-label="重新计算"
  >
    重新计算
  </button>
</div>
