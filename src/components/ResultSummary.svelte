<script lang="ts">
  import { formatAge, formatDate, getImpactData } from '../helper/lifeSpent';
  import { buildShareUrl, copyShareUrl, dateToBirthString } from '../helper/urlParams';
  import ImpactWeeksWall from './impact/ImpactWeeksWall.svelte';
  import ImpactTimeStrata from './impact/ImpactTimeStrata.svelte';
  import ImpactHeartbeatStrip from './impact/ImpactHeartbeatStrip.svelte';
  import ImpactGridAges from './impact/ImpactGridAges.svelte';
  import type { LifeCalculation } from '../types/main';

  export let result: LifeCalculation;
  export let onReset: () => void;

  type ImpactView = 'strata' | 'weeks' | 'heartbeat' | 'grid';
  let impactView: ImpactView = 'grid';

  // Share functionality
  let shareUrl = '';
  let copySuccess = false;
  let copyTimeout: ReturnType<typeof setTimeout> | null = null;

  $: percentDisplay = result.percentSpent.toFixed(2);
  $: filledPercent = Math.min(Math.max(result.percentSpent, 0), 100);
  $: remainingPercent = Math.max(100 - result.percentSpent, 0).toFixed(2);
  $: impactData = getImpactData(result);
  $: relativePercentDisplay = result.relativeAgePercent.toFixed(1);
  $: medianGap = result.yearsToMedianAge;
  $: medianGapLabel =
    medianGap >= 0
      ? `距离人口中位年龄还有 ${formatAge(medianGap)}`
      : `已超过人口中位年龄 ${formatAge(Math.abs(medianGap))}`;
  $: expectancyGapLabel =
    result.yearsRemaining > 0
      ? `距离平均预期寿命还有 ${formatAge(result.yearsRemaining)}`
      : '已到达平均预期寿命参考值';

  // Build share URL when result changes
  $: shareUrl = buildShareUrl({
    birth: dateToBirthString(result.birthDate),
    gender: result.gender,
    lifeExpectancy: result.lifeExpectancy,
    populationMedianAge: result.populationMedianAge
  });

  async function handleShare() {
    const success = await copyShareUrl(shareUrl);
    if (success) {
      copySuccess = true;
      // Clear previous timeout if exists
      if (copyTimeout) clearTimeout(copyTimeout);
      // Reset success message after 2 seconds
      copyTimeout = setTimeout(() => {
        copySuccess = false;
      }, 2000);
    }
  }
</script>

<div class="glass-card rounded-2xl p-8 md:p-12 max-w-2xl w-full space-y-8">
  <!-- 相对年龄位置 - 顶部突出显示 -->
  <div class="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 via-ink-900/80 to-ink-950 border border-white/10 p-6 text-center light:from-black/5 light:via-paper-100/80 light:to-paper-50 light:border-black/10">
    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent light:via-black/5" />
    <p class="relative text-xs md:text-sm uppercase tracking-[0.4em] text-paper-200/70 mb-2 light:text-ink-500">
      相对年龄位置
    </p>
    <p class="relative text-6xl md:text-8xl font-light text-paper-50 tracking-tight light:text-ink-950">
      {relativePercentDisplay}<span class="text-3xl md:text-4xl">%</span>
    </p>
    <p class="relative text-xs text-neutral-500 mt-3 tracking-widest light:text-neutral-600">
      比你年龄大的人群比例
    </p>
  </div>

  <!-- 已度过百分比 -->
  <div class="text-center space-y-2">
    <h2 class="text-5xl md:text-7xl font-light text-paper-50 tracking-tight light:text-ink-950">
      {percentDisplay}%
    </h2>
    <p class="text-lg md:text-xl text-neutral-400 font-light light:text-neutral-600">
      已度过
    </p>
    <div class="space-y-1">
      <div class="w-full h-2 rounded-full bg-white/5 border border-white/10 overflow-hidden light:bg-black/5 light:border-black/10">
        <div
          class="h-full rounded-full bg-paper-100 transition-[width] duration-500 ease-out light:bg-ink-950"
          style={`width:${filledPercent}%`}
          role="presentation"
        />
      </div>
    <p class="text-[0.65rem] uppercase tracking-[0.4em] text-neutral-500 light:text-neutral-600">
        余下 {remainingPercent}% · 参考平均预期寿命是统计
    </p>
  </div>
  </div>

  <div class="space-y-4">
    <div class="flex flex-wrap gap-2" role="tablist" aria-label="冲击力展示方式">
      <button
        type="button"
        role="tab"
        aria-selected={impactView === 'grid'}
        aria-controls="impact-panel"
        id="tab-grid"
        class="px-3 py-2 text-xs uppercase tracking-[0.3em] rounded-lg border transition-colors cursor-pointer {impactView === 'grid'
          ? 'bg-white/10 border-white/20 text-paper-100 light:bg-black/10 light:border-black/20 light:text-ink-950'
          : 'bg-white/5 border-white/10 text-neutral-400 hover:border-white/20 hover:text-paper-100 light:bg-black/5 light:border-black/10 light:text-neutral-600 light:hover:border-black/20 light:hover:text-ink-950'}"
        on:click={() => (impactView = 'grid')}
      >
        年龄格
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={impactView === 'strata'}
        aria-controls="impact-panel"
        id="tab-strata"
        class="px-3 py-2 text-xs uppercase tracking-[0.3em] rounded-lg border transition-colors cursor-pointer {impactView === 'strata'
          ? 'bg-white/10 border-white/20 text-paper-100 light:bg-black/10 light:border-black/20 light:text-ink-950'
          : 'bg-white/5 border-white/10 text-neutral-400 hover:border-white/20 hover:text-paper-100 light:bg-black/5 light:border-black/10 light:text-neutral-600 light:hover:border-black/20 light:hover:text-ink-950'}"
        on:click={() => (impactView = 'strata')}
      >
        时间层
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={impactView === 'weeks'}
        aria-controls="impact-panel"
        id="tab-weeks"
        class="px-3 py-2 text-xs uppercase tracking-[0.3em] rounded-lg border transition-colors cursor-pointer {impactView === 'weeks'
          ? 'bg-white/10 border-white/20 text-paper-100 light:bg-black/10 light:border-black/20 light:text-ink-950'
          : 'bg-white/5 border-white/10 text-neutral-400 hover:border-white/20 hover:text-paper-100 light:bg-black/5 light:border-black/10 light:text-neutral-600 light:hover:border-black/20 light:hover:text-ink-950'}"
        on:click={() => (impactView = 'weeks')}
      >
        周历墙
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={impactView === 'heartbeat'}
        aria-controls="impact-panel"
        id="tab-heartbeat"
        class="px-3 py-2 text-xs uppercase tracking-[0.3em] rounded-lg border transition-colors cursor-pointer {impactView === 'heartbeat'
          ? 'bg-white/10 border-white/20 text-paper-100 light:bg-black/10 light:border-black/20 light:text-ink-950'
          : 'bg-white/5 border-white/10 text-neutral-400 hover:border-white/20 hover:text-paper-100 light:bg-black/5 light:border-black/10 light:text-neutral-600 light:hover:border-black/20 light:hover:text-ink-950'}"
        on:click={() => (impactView = 'heartbeat')}
      >
        节拍刻度
      </button>
    </div>
    <div id="impact-panel" role="tabpanel" aria-labelledby="tab-{impactView}" class="glass-card rounded-xl p-5 border border-white/10 light:border-black/10">
      {#if impactView === 'strata'}
        <ImpactTimeStrata data={impactData} />
      {:else if impactView === 'weeks'}
        <ImpactWeeksWall data={impactData} />
      {:else if impactView === 'heartbeat'}
        <ImpactHeartbeatStrip {result} data={impactData} />
      {:else}
        <ImpactGridAges data={impactData} />
      {/if}
    </div>
  </div>

  <dl class="grid grid-cols-2 gap-x-6 gap-y-4 text-sm md:text-base text-neutral-300 light:text-neutral-700">
    <div class="flex flex-col">
      <dt class="text-xs text-neutral-500 uppercase tracking-[0.3em] light:text-neutral-600">出生日期</dt>
      <dd class="font-medium text-paper-50 light:text-ink-950">{formatDate(result.birthDate)}</dd>
    </div>
    <div class="flex flex-col">
      <dt class="text-xs text-neutral-500 uppercase tracking-[0.3em] light:text-neutral-600">当前年龄</dt>
      <dd class="font-medium text-paper-50 light:text-ink-950">{formatAge(result.currentAge)}</dd>
    </div>
    <div class="flex flex-col">
      <dt class="text-xs text-neutral-500 uppercase tracking-[0.3em] light:text-neutral-600">平均预期寿命</dt>
      <dd class="font-medium text-paper-50 light:text-ink-950">{result.lifeExpectancy} 岁</dd>
    </div>
    <div class="flex flex-col">
      <dt class="text-xs text-neutral-500 uppercase tracking-[0.3em] light:text-neutral-600">预计剩余</dt>
      <dd class="font-medium text-paper-50 light:text-ink-950">{formatAge(result.yearsRemaining)}</dd>
    </div>
    <div class="flex flex-col">
      <dt class="text-xs text-neutral-500 uppercase tracking-[0.3em] light:text-neutral-600">人口中位年龄</dt>
      <dd class="font-medium text-paper-50 light:text-ink-950">{result.populationMedianAge} 岁</dd>
    </div>
    <div class="flex flex-col">
      <dt class="text-xs text-neutral-500 uppercase tracking-[0.3em] light:text-neutral-600">相对年龄位置</dt>
      <dd class="font-medium text-paper-50 light:text-ink-950">{relativePercentDisplay}%</dd>
    </div>
  </dl>

  <div class="grid gap-3 md:grid-cols-2">
    <div class="glass-card rounded-xl border border-white/10 p-4 text-sm text-neutral-300 space-y-2 light:border-black/10 light:text-neutral-700">
      <p class="text-xs uppercase tracking-[0.3em] text-neutral-500 light:text-neutral-600">相对年龄</p>
      <p class="text-paper-50 font-medium light:text-ink-950">{medianGapLabel}</p>
      <p class="text-xs text-neutral-400 light:text-neutral-600">
        当你超过人口中位年龄，意味着你已比一半的人更年长。
      </p>
    </div>
    <div class="glass-card rounded-xl border border-paper-200/20 p-4 text-sm text-neutral-300 space-y-2 light:border-black/10 light:text-neutral-700">
      <p class="text-xs uppercase tracking-[0.3em] text-paper-200/80 light:text-neutral-600">预期寿命</p>
      <p class="text-paper-100 font-medium light:text-ink-950">{expectancyGapLabel}</p>
      <p class="text-xs text-neutral-400 light:text-neutral-600">
        这是一个统计参考，不是命运。它提醒我们该把时间放在真正重要的地方。
      </p>
    </div>
  </div>

  <div class="bg-paper-100/10 border border-paper-200/20 rounded-xl p-4 text-sm text-neutral-300 leading-relaxed space-y-2 light:bg-black/5 light:border-black/10 light:text-neutral-700">
    <p>平均预期寿命不是终点，而是参考值。正视剩余时间，让每天都更清醒。</p>
    <p class="text-paper-100/90 font-medium light:text-ink-950">若你已接近人群中位年龄，那道「还年轻」的门槛早已在身后。</p>
  </div>

  <div class="flex gap-3">
    <button
      on:click={handleShare}
      class="flex-1 px-6 py-3 bg-paper-50/95 hover:bg-paper-100 border border-paper-100/70
             hover:border-paper-200 text-ink-950 rounded-xl transition-all cursor-pointer
             light:bg-ink-950 light:text-paper-50 light:border-ink-900 light:hover:bg-ink-900
             active:scale-[0.98] flex items-center justify-center gap-2"
      aria-label="分享计算结果"
    >
      {#if copySuccess}
        <span class="text-ink-950 light:text-paper-50">已复制</span>
      {:else}
        <span>分享链接</span>
      {/if}
    </button>
    <button
      on:click={onReset}
      class="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20
             text-neutral-200 rounded-xl transition-all cursor-pointer
             light:bg-black/5 light:hover:bg-black/10 light:border-black/10 light:hover:border-black/20 light:text-neutral-700"
      aria-label="重新计算"
    >
      重新计算
    </button>
  </div>
</div>
