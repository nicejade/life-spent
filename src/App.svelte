<script lang="ts">
  import { onMount } from 'svelte';
  import { calculateLifePercent } from './helper/lifeSpent';
  import { parseShareParams, birthStringToDate } from './helper/urlParams';
  import InputPanel from './components/InputPanel.svelte';
  import ResultSummary from './components/ResultSummary.svelte';
  import Header from './components/Header.svelte';
  import { DEFAULT_LIFE_EXPECTANCY } from './helper/constant'
  import type { Gender, LifeCalculation } from './types/main';
  import { trackEvent, GA_EVENTS } from './helper/ga';

  let result: LifeCalculation | null = null;

  // Check for share parameters on mount
  onMount(() => {
    // Track page view on load
    trackEvent(GA_EVENTS.PAGE_VIEW, {
      page: 'home',
      timestamp: new Date().toISOString(),
    });

    const shareParams = parseShareParams();
    if (shareParams) {
      const birthDate = birthStringToDate(shareParams.birth);
      result = calculateLifePercent({
        birthDate,
        gender: shareParams.gender,
        lifeExpectancy: shareParams.lifeExpectancy,
        populationMedianAge: shareParams.populationMedianAge
      });
    }
  });

  function handleCalculate(
    birthDate: Date,
    gender: Gender,
    lifeExpectancy: number,
    populationMedianAge: number
  ) {
    result = calculateLifePercent({ birthDate, gender, lifeExpectancy, populationMedianAge });
  }

  function handleReset() {
    result = null;
    // Clear URL parameters when resetting
    const url = new URL(window.location.href);
    url.search = '';
    window.history.replaceState({}, '', url.toString());
  }
</script>

<main class="min-h-screen relative overflow-hidden bg-ink-950 text-paper-50 light:bg-paper-50 light:text-ink-950 transition-colors duration-300 motion-reduce:transition-none">
  <div class="pointer-events-none absolute inset-0 transition-colors duration-300 motion-reduce:transition-none">
    <div class="absolute -top-16 left-1/2 w-[520px] h-[520px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl light:bg-black/5" />
    <div class="absolute bottom-0 right-0 w-[360px] h-[360px] bg-paper-100/10 blur-3xl light:bg-black/5" />
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_55%)] light:bg-[radial-gradient(circle_at_top,_rgba(15,15,15,0.08),_transparent_55%)]" />
  </div>

  <Header />

  <div class="relative z-10 container mx-auto px-4 py-10 lg:py-14 space-y-10">
    <header class="max-w-4xl space-y-3 text-center md:text-left">
      <p class="text-xs uppercase tracking-[0.5em] text-paper-200/70 light:text-gray-600">
        LifeSpent · 反思之旅
      </p>
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight">
        透过数据，与生命的流逝保持恰到好处的距离
      </h1>
      <p class="text-base md:text-lg text-neutral-300 light:text-neutral-700 max-w-3xl">
        以简洁的界面告诉你已走过的岁月，借助平均预期寿命与人群中位年龄提醒自己不止于当前的舒适。保持沉静，感受每一次呼吸。
      </p>
    </header>

    <section class="flex flex-col gap-8 xl:flex-row xl:items-start">
      <div class="flex-1">
        {#if result === null}
          <InputPanel onCalculate={handleCalculate} />
        {:else}
          <ResultSummary result={result} onReset={handleReset} />
        {/if}
      </div>

      <aside class="xl:w-72 space-y-4 flex-shrink-0">
        <div class="glass-card rounded-2xl p-6 space-y-3">
          <p class="text-xs uppercase tracking-[0.4em] text-neutral-400 light:text-neutral-500">提醒</p>
          <p class="text-sm text-neutral-200 light:text-neutral-700 leading-relaxed">
            平均预期寿命只是参考，无需恐慌。每一次深呼吸都是对剩余时间的拥抱。
          </p>
          <div class="text-[0.75rem] text-neutral-400/80 light:text-neutral-500 tracking-[0.3em] uppercase">
            男 {DEFAULT_LIFE_EXPECTANCY.male} · 女 {DEFAULT_LIFE_EXPECTANCY.female}
          </div>
          <div class="h-px bg-white/10 light:bg-black/10" />
          <p class="text-xs text-neutral-400 light:text-neutral-600">
            如有需要，可在输入面板中自定义平均预期寿命与人群中位年龄参考值。
          </p>
        </div>

        <div class="glass-card rounded-2xl p-6 space-y-3">
          <p class="text-xs uppercase tracking-[0.4em] text-neutral-400 light:text-neutral-500">珍惜</p>
          <p class="text-sm text-neutral-200 light:text-neutral-700 leading-relaxed">
            时间是最公平的礼物，每一秒都不可复制。与其焦虑未来，不如专注当下。
          </p>
          <p class="text-sm text-paper-100 light:text-ink-900">
            珍惜此刻，就是珍惜生命本身。
          </p>
        </div>
      </aside>
    </section>
  </div>

  <footer class="relative z-10 py-8 text-center text-xs text-neutral-500 light:text-neutral-600">
    <p>仅作提醒，珍惜时间</p>
  </footer>
</main>
