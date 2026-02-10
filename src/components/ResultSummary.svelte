<script lang="ts">
  import { onDestroy, tick } from 'svelte';
  import { snapdom } from '@zumer/snapdom';
  import { formatAge, formatDate, getImpactData } from '../helper/lifeSpent';
  import { buildShareUrl, copyShareUrl, dateToBirthString } from '../helper/urlParams';
  import ImpactWeeksWall from './impact/ImpactWeeksWall.svelte';
  import ImpactTimeStrata from './impact/ImpactTimeStrata.svelte';
  import ImpactHeartbeatStrip from './impact/ImpactHeartbeatStrip.svelte';
  import ImpactGridAges from './impact/ImpactGridAges.svelte';
  import type { LifeCalculation } from '../types/main';
  import { trackEvent, GA_EVENTS } from '../helper/ga';
  import { theme } from '../helper/theme';
  import { t, formatString } from '../helper/i18n';

  export let result: LifeCalculation;
  export let onReset: () => void;

  type ImpactView = 'strata' | 'weeks' | 'heartbeat' | 'grid';
  let impactView: ImpactView = 'grid';

  // Share functionality
  let captureTarget: HTMLDivElement | null = null;
  let shareUrl = '';
  let copySuccess = false;
  let copyTimeout: ReturnType<typeof setTimeout> | null = null;
  let copyImageBusy = false;
  let copyImageSuccess = false;
  let copyImageError = false;
  let copyImageTimeout: ReturnType<typeof setTimeout> | null = null;

  $: percentDisplay = result.percentSpent.toFixed(2);
  $: filledPercent = Math.min(Math.max(result.percentSpent, 0), 100);
  $: remainingPercent = Math.max(100 - result.percentSpent, 0).toFixed(2);
  $: impactData = getImpactData(result, $t);
  $: relativeDeltaYears = result.relativeAgeDeltaYears;
  $: relativeDeltaYearsDisplay = `${relativeDeltaYears >= 0 ? '+' : '-'}${Math.abs(relativeDeltaYears).toFixed(1)}`;
  $: relativeDeltaPercent = result.relativeAgeDeltaPercent;
  $: relativeDeltaPercentDisplay = `${relativeDeltaPercent >= 0 ? '+' : '-'}${Math.abs(relativeDeltaPercent).toFixed(1)}`;
  $: filledPercentColor = getFilledPercentColor(filledPercent);
  $: relativeDeltaBaseColor = $theme === 'light' ? 'rgb(11 11 11)' : 'rgb(255 255 255)';
  $: relativeDeltaColor = relativeDeltaPercent < 0
    ? relativeDeltaBaseColor
    : getRelativeDeltaColor(Math.min(Math.abs(relativeDeltaPercent), 100), $theme);
  $: medianGap = result.yearsToMedianAge;
  $: medianGapLabel =
    medianGap >= 0
      ? formatString($t.resultSummary.medianGapBefore, { age: formatAge(medianGap) })
      : formatString($t.resultSummary.medianGapAfter, { age: formatAge(Math.abs(medianGap)) });
  $: expectancyGapLabel =
    result.yearsRemaining > 0
      ? formatString($t.resultSummary.expectancyGapBefore, { age: formatAge(result.yearsRemaining) })
      : $t.resultSummary.expectancyGapReached;
  $: shareText = formatString($t.resultSummary.shareText, {
    percent: percentDisplay,
    age: formatAge(result.currentAge)
  });
  $: copyImageLabel = copyImageBusy
    ? $t.resultSummary.copyImageBusy
    : copyImageSuccess
      ? $t.resultSummary.copyImageDone
      : copyImageError
        ? $t.resultSummary.copyImageFailed
        : $t.resultSummary.copyImage;

  // Build share URL when result changes
  $: shareUrl = buildShareUrl({
    birth: dateToBirthString(result.birthDate),
    gender: result.gender,
    lifeExpectancy: result.lifeExpectancy,
    populationMedianAge: result.populationMedianAge
  });

  function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  function lerp(a: number, b: number, t: number) {
    return Math.round(a + (b - a) * t);
  }

  function mixRgb(from: [number, number, number], to: [number, number, number], t: number) {
    const clamped = clamp(t, 0, 1);
    return [lerp(from[0], to[0], clamped), lerp(from[1], to[1], clamped), lerp(from[2], to[2], clamped)];
  }

  function getRelativeDeltaColor(percent: number, themeValue: 'dark' | 'light') {
    const normalized = clamp(percent, 0, 100) / 100;
    const pivot = 0.7;
    const base: [number, number, number] = themeValue === 'light' ? [11, 11, 11] : [255, 255, 255];
    const yellow: [number, number, number] = [255, 199, 0];
    const red: [number, number, number] = [220, 38, 38];
    const rgb =
      normalized <= pivot
        ? mixRgb(base, yellow, normalized / pivot)
        : mixRgb(yellow, red, (normalized - pivot) / (1 - pivot));
    return `rgb(${rgb[0]} ${rgb[1]} ${rgb[2]})`;
  }

  function getFilledPercentColor(percent: number) {
    const normalized = clamp(percent, 0, 100) / 100;
    const pivot = 0.7;
    const white: [number, number, number] = [255, 255, 255];
    const yellow: [number, number, number] = [255, 199, 0];
    const red: [number, number, number] = [220, 38, 38];
    const rgb =
      normalized <= pivot
        ? mixRgb(white, yellow, normalized / pivot)
        : mixRgb(yellow, red, (normalized - pivot) / (1 - pivot));
    return `rgb(${rgb[0]} ${rgb[1]} ${rgb[2]})`;
  }

  async function handleShare() {
    trackEvent(GA_EVENTS.SHARE_CLICK);
    const success = await copyShareUrl(shareUrl);
    if (success) {
      copySuccess = true;
      if (copyTimeout) clearTimeout(copyTimeout);
      copyTimeout = setTimeout(() => {
        copySuccess = false;
      }, 2000);
      trackEvent(GA_EVENTS.SHARE_COPY);
    }
  }

  function resetCopyImageState() {
    copyImageSuccess = false;
    copyImageError = false;
    if (copyImageTimeout) clearTimeout(copyImageTimeout);
    copyImageTimeout = null;
  }

  async function createShareImageBlob() {
    if (!captureTarget) {
      throw new Error('missing share target');
    }
    await tick();
    if (document?.fonts?.ready) {
      await document.fonts.ready;
    }
    const result = await snapdom(captureTarget, {
      scale: 2,
      embedFonts: true,
      exclude: ['[data-share-control]'],
      excludeMode: 'remove',
    });
    const blob = await result.toBlob({ type: 'png' });
    if (!blob || blob.size === 0) {
      throw new Error('empty share image');
    }
    return blob;
  }

  async function handleCopyImage() {
    if (copyImageBusy) return;
    copyImageBusy = true;
    resetCopyImageState();

    try {
      const blob = await createShareImageBlob();
      const item = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([item]);
      copyImageSuccess = true;
      copyImageTimeout = setTimeout(() => {
        copyImageSuccess = false;
      }, 2000);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        copyImageError = true;
        copyImageTimeout = setTimeout(() => {
          copyImageError = false;
        }, 2000);
      }
    } finally {
      copyImageBusy = false;
    }
  }

  function handleShareToTwitter() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function handleShareToFacebook() {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function handleViewChange(view: ImpactView) {
    impactView = view;
    const eventMap: Record<ImpactView, string> = {
      grid: GA_EVENTS.VIEW_GRID,
      strata: GA_EVENTS.VIEW_STRATA,
      weeks: GA_EVENTS.VIEW_WEEKS,
      heartbeat: GA_EVENTS.VIEW_HEARTBEAT,
    };
    trackEvent(eventMap[view], { view });
  }

  function handleResetClick() {
    trackEvent(GA_EVENTS.RESET_CALCULATE);
    onReset();
  }

  onDestroy(() => {
    if (copyTimeout) clearTimeout(copyTimeout);
    if (copyImageTimeout) clearTimeout(copyImageTimeout);
  });
</script>

<div
  class="glass-card rounded-2xl p-8 md:p-12 max-w-2xl w-full space-y-8"
  bind:this={captureTarget}
>
  <!-- 相对年龄位置 - 顶部突出显示 -->
  <div class="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 via-ink-900/80 to-ink-950 border border-white/10 p-6 text-center light:from-black/5 light:via-paper-100/80 light:to-paper-50 light:border-black/10">
    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent light:via-black/5" />
    <p class="relative text-xs md:text-sm uppercase tracking-[0.4em] text-paper-200/70 mb-2 light:text-ink-500">
      {$t.resultSummary.relativeAgePosition}
    </p>
    <p class="relative text-xs text-neutral-500 mt-3 tracking-widest light:text-neutral-600">
      {$t.resultSummary.relativeAgeQuestion}
    </p>
    <p
      class="relative text-6xl md:text-8xl font-light text-paper-50 tracking-tight light:text-ink-950"
      style={`color:${relativeDeltaColor}`}
    >
      {relativeDeltaYearsDisplay}<span class="text-3xl md:text-4xl">{$t.common.yearsOld}</span>
    </p>
    <p class="relative text-base text-neutral-500 mt-2 tracking-[0.4em] light:text-neutral-600" style={`color:${relativeDeltaColor}`}>
      {relativeDeltaPercentDisplay}%
    </p>
  </div>

  <!-- 已度过百分比 -->
  <div class="text-center space-y-2">
    <h2
      class="text-5xl md:text-7xl font-light text-paper-50 tracking-tight light:text-ink-950"
      style={`color:${filledPercentColor}`}
    >
      {percentDisplay}%
    </h2>
    <p class="text-lg md:text-xl text-neutral-400 font-light light:text-neutral-600">
      {$t.resultSummary.percentSpent}
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
        {$t.resultSummary.remaining} {remainingPercent}% · {$t.resultSummary.referenceNote}
    </p>
  </div>
  </div>

  <div class="space-y-4">
    <div class="flex flex-wrap gap-2" role="tablist" aria-label={$t.resultSummary.impactViews}>
      <button
        type="button"
        role="tab"
        aria-selected={impactView === 'grid'}
        aria-controls="impact-panel"
        id="tab-grid"
        class="px-3 py-2 text-xs uppercase tracking-[0.3em] rounded-lg border transition-colors cursor-pointer {impactView === 'grid'
          ? 'bg-white/10 border-white/20 text-paper-100 light:bg-black/10 light:border-black/20 light:text-ink-950'
          : 'bg-white/5 border-white/10 text-neutral-400 hover:border-white/20 hover:text-paper-100 light:bg-black/5 light:border-black/10 light:text-neutral-600 light:hover:border-black/20 light:hover:text-ink-950'}"
        on:click={() => handleViewChange('grid')}
      >
        {$t.resultSummary.viewGrid}
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
        on:click={() => handleViewChange('strata')}
      >
        {$t.resultSummary.viewStrata}
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
        on:click={() => handleViewChange('weeks')}
      >
        {$t.resultSummary.viewWeeks}
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
        on:click={() => handleViewChange('heartbeat')}
      >
        {$t.resultSummary.viewHeartbeat}
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
      <dt class="text-xs text-neutral-500 uppercase tracking-[0.3em] light:text-neutral-600">{$t.resultSummary.birthDate}</dt>
      <dd class="font-medium text-paper-50 light:text-ink-950">{formatDate(result.birthDate)}</dd>
    </div>
    <div class="flex flex-col">
      <dt class="text-xs text-neutral-500 uppercase tracking-[0.3em] light:text-neutral-600">{$t.resultSummary.currentAge}</dt>
      <dd class="font-medium text-paper-50 light:text-ink-950">{formatAge(result.currentAge)} {$t.common.yearsOld}</dd>
    </div>
    <div class="flex flex-col">
      <dt class="text-xs text-neutral-500 uppercase tracking-[0.3em] light:text-neutral-600">{$t.resultSummary.lifeExpectancy}</dt>
      <dd class="font-medium text-paper-50 light:text-ink-950">{result.lifeExpectancy} {$t.common.yearsOld}</dd>
    </div>
    <div class="flex flex-col">
      <dt class="text-xs text-neutral-500 uppercase tracking-[0.3em] light:text-neutral-600">{$t.resultSummary.yearsRemaining}</dt>
      <dd class="font-medium text-paper-50 light:text-ink-950">{formatAge(result.yearsRemaining)} {$t.common.yearsOld}</dd>
    </div>
    <div class="flex flex-col">
      <dt class="text-xs text-neutral-500 uppercase tracking-[0.3em] light:text-neutral-600">{$t.resultSummary.populationMedianAge}</dt>
      <dd class="font-medium text-paper-50 light:text-ink-950">{result.populationMedianAge} {$t.common.yearsOld}</dd>
    </div>
    <div class="flex flex-col">
      <dt class="text-xs text-neutral-500 uppercase tracking-[0.3em] light:text-neutral-600">{$t.resultSummary.relativeAge}</dt>
      <dd class="font-medium text-paper-50 light:text-ink-950" style={`color:${relativeDeltaColor}`}>
        {relativeDeltaYearsDisplay} {$t.common.yearsOld}
      </dd>
    </div>
  </dl>

  <div class="grid gap-3 md:grid-cols-2">
    <div class="glass-card rounded-xl border border-white/10 p-4 text-sm text-neutral-300 space-y-2 light:border-black/10 light:text-neutral-700">
      <p class="text-xs uppercase tracking-[0.3em] text-neutral-500 light:text-neutral-600">{$t.resultSummary.relativeAge}</p>
      <p class="text-paper-50 font-medium light:text-ink-950">{medianGapLabel}</p>
      <p class="text-xs text-neutral-400 light:text-neutral-600">
        {$t.resultSummary.medianGapNote}
      </p>
    </div>
    <div class="glass-card rounded-xl border border-paper-200/20 p-4 text-sm text-neutral-300 space-y-2 light:border-black/10 light:text-neutral-700">
      <p class="text-xs uppercase tracking-[0.3em] text-paper-200/80 light:text-neutral-600">{$t.resultSummary.lifeExpectancy}</p>
      <p class="text-paper-100 font-medium light:text-ink-950">{expectancyGapLabel}</p>
      <p class="text-xs text-neutral-400 light:text-neutral-600">
        {$t.resultSummary.expectancyGapNote}
      </p>
    </div>
  </div>

  <div class="bg-paper-100/10 border border-paper-200/20 rounded-xl p-4 text-sm text-neutral-300 leading-relaxed space-y-2 light:bg-black/5 light:border-black/10 light:text-neutral-700">
    <p>{$t.resultSummary.reflectionContent}</p>
    <p class="text-paper-100/90 font-black light:text-ink-950">{$t.resultSummary.reflectionConclusion}</p>
  </div>

  <div class="space-y-3" data-share-control>
    <div class="grid gap-3 md:grid-cols-2">
      <button
        on:click={handleShare}
        class="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20
               text-neutral-200 rounded-xl transition-all cursor-pointer
               light:bg-black/5 light:hover:bg-black/10 light:border-black/10 light:hover:border-black/20 light:text-neutral-700"
        aria-label={$t.resultSummary.shareLink}
      >
        {#if copySuccess}
          <span class="text-ink-950 light:text-paper-50">{$t.resultSummary.copied}</span>
        {:else}
          <span>{$t.resultSummary.shareLink}</span>
        {/if}
      </button>
      <button
        on:click={handleCopyImage}
        class="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20
               text-neutral-200 rounded-xl transition-all cursor-pointer
               light:bg-black/5 light:hover:bg-black/10 light:border-black/10 light:hover:border-black/20 light:text-neutral-700
               disabled:cursor-not-allowed disabled:opacity-60"
        aria-label={$t.resultSummary.copyImage}
        disabled={copyImageBusy}
      >
        <span class={copyImageSuccess ? 'text-amber-200' : copyImageError ? 'text-red-200' : ''}>
          {copyImageLabel}
        </span>
      </button>
      <button
        on:click={handleShareToTwitter}
        class="px-6 py-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-200/40
               text-amber-100 rounded-xl transition-all cursor-pointer
               light:bg-amber-500/15 light:hover:bg-amber-500/25 light:border-amber-500/30 light:text-amber-700"
        aria-label={$t.resultSummary.shareToTwitter}
      >
        {$t.resultSummary.shareToTwitter}
      </button>
      <button
        on:click={handleShareToFacebook}
        class="px-6 py-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-200/40
               text-amber-100 rounded-xl transition-all cursor-pointer
               light:bg-amber-500/15 light:hover:bg-amber-500/25 light:border-amber-500/30 light:text-amber-700"
        aria-label={$t.resultSummary.shareToFacebook}
      >
        {$t.resultSummary.shareToFacebook}
      </button>
    </div>
    <button
      on:click={handleResetClick}
      class="w-full px-6 py-3 bg-paper-50/95 hover:bg-paper-100 border border-paper-100/70
             hover:border-paper-200 text-ink-950 rounded-xl transition-all cursor-pointer
             light:bg-ink-950 light:text-paper-50 light:border-ink-900 light:hover:bg-ink-900
             active:scale-[0.98] flex items-center justify-center gap-2"
      aria-label={$t.resultSummary.reset}
    >
      {$t.resultSummary.reset}
    </button>
  </div>
</div>
