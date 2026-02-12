<script lang="ts">
  import { onMount } from 'svelte';
  import { calculateLifePercent, validateBirthDate } from './helper/lifeSpent';
  import { parseShareParams, birthStringToDate } from './helper/urlParams';
  import InputPanel from './components/InputPanel.svelte';
  import ResultSummary from './components/ResultSummary.svelte';
  import Header from './components/Header.svelte';
  import Footer from './components/Footer.svelte';
  import { DEFAULT_LIFE_EXPECTANCY, DEFAULT_POPULATION_MEDIAN_AGE, STORAGE_KEY, LIFE_EXPECTANCY_MIN, LIFE_EXPECTANCY_MAX, POPULATION_MEDIAN_AGE_MIN, POPULATION_MEDIAN_AGE_MAX } from './helper/constant'
  import type { Gender, LifeCalculation } from './types/main';
  import { trackEvent, GA_EVENTS } from './helper/ga';
  import { locale, getLocaleFromPath, getPathWithoutLocale, getLocalizedPath, t, formatString } from './helper/i18n';
  import { get } from 'svelte/store';

  let result: LifeCalculation | null = null;
  let hasCalculatedThisSession = false;

  // Record whether localStorage had settings before initial render (avoids showing ResultSummary from defaults InputPanel writes)
  let hadStoredSettingsOnLoad = false;
  if (typeof window !== 'undefined') {
    try {
      hadStoredSettingsOnLoad = !!localStorage.getItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  interface StoredSettings {
    selectedYear: string;
    selectedMonth: string;
    selectedDay: string;
    gender: Gender;
    lifeExpectancyInput: string;
    populationMedianAgeInput: string;
  }

  function loadSettingsFromStorage(): StoredSettings | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore parse errors
    }
    return null;
  }

  function loadAndCalculateFromStorage(): void {
    const settings = loadSettingsFromStorage();
    if (!settings) {
      return;
    }

    // 验证必要的字段是否存在
    if (!settings.selectedYear || !settings.selectedMonth || !settings.selectedDay || !settings.gender) {
      return;
    }

    // 构建出生日期
    const year = parseInt(settings.selectedYear, 10);
    const month = parseInt(settings.selectedMonth, 10);
    const day = parseInt(settings.selectedDay, 10);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return;
    }

    const birthDate = new Date(year, month - 1, day);

    // 验证日期有效性
    if (isNaN(birthDate.getTime()) || !validateBirthDate(birthDate)) {
      return;
    }

    // 获取期望寿命和人口中位年龄
    const lifeExpectancyParsed = parseFloat(settings.lifeExpectancyInput);
    const lifeExpectancy = isNaN(lifeExpectancyParsed) || lifeExpectancyParsed < LIFE_EXPECTANCY_MIN || lifeExpectancyParsed > LIFE_EXPECTANCY_MAX
      ? DEFAULT_LIFE_EXPECTANCY[settings.gender]
      : lifeExpectancyParsed;
    
    // 判断用户是否手动设置了预期寿命
    const isLifeExpectancyCustom = !isNaN(lifeExpectancyParsed) && 
      lifeExpectancyParsed >= LIFE_EXPECTANCY_MIN && 
      lifeExpectancyParsed <= LIFE_EXPECTANCY_MAX;

    const populationMedianAgeParsed = parseFloat(settings.populationMedianAgeInput);
    const populationMedianAge = isNaN(populationMedianAgeParsed) || populationMedianAgeParsed < POPULATION_MEDIAN_AGE_MIN || populationMedianAgeParsed > POPULATION_MEDIAN_AGE_MAX
      ? DEFAULT_POPULATION_MEDIAN_AGE
      : populationMedianAgeParsed;

    // 计算并显示结果
    result = calculateLifePercent({
      birthDate,
      gender: settings.gender,
      lifeExpectancy,
      populationMedianAge,
      isLifeExpectancyCustom
    });
  }

  // Check for share parameters on mount
  onMount(() => {
    // Handle locale from URL path
    const pathLocale = getLocaleFromPath(window.location.pathname);
    if (pathLocale) {
      locale.set(pathLocale);
    } else {
      // If no locale in path, redirect to localized path
      const currentPath = getPathWithoutLocale(window.location.pathname);
      const localizedPath = getLocalizedPath(currentPath);
      if (localizedPath !== window.location.pathname) {
        window.history.replaceState({}, '', localizedPath);
      }
    }

    // Update document lang attribute and meta tags
    locale.subscribe((loc) => {
      document.documentElement.lang = loc === 'zh-TW' ? 'zh-Hant' : loc === 'zh' ? 'zh-Hans' : loc;
      
      // Update meta tags (SEO / GEO / AEO: use localized documentTitle and metaDescription)
      const translations = get(t);
      const title = translations.app.documentTitle;
      const description = translations.app.metaDescription;

      document.title = title;
      
      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);
      
      // Update OG tags
      const updateMeta = (property: string, content: string) => {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };
      
      updateMeta('og:title', title);
      updateMeta('og:description', description);
      updateMeta('og:locale', loc === 'zh-TW' ? 'zh_TW' : loc === 'zh' ? 'zh_CN' : loc.replace('-', '_'));
      
      // Update Twitter tags
      const updateTwitterMeta = (name: string, content: string) => {
        let meta = document.querySelector(`meta[name="twitter:${name}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('name', `twitter:${name}`);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };
      
      updateTwitterMeta('title', title);
      updateTwitterMeta('description', description);
    });

    // Track page view on load
    trackEvent(GA_EVENTS.PAGE_VIEW, {
      page: 'home',
      timestamp: new Date().toISOString(),
    });

    const shareParams = parseShareParams();
    if (shareParams) {
      const birthDate = birthStringToDate(shareParams.birth);
      // 从 URL 参数中获取的预期寿命视为用户手动设置的
      result = calculateLifePercent({
        birthDate,
        gender: shareParams.gender,
        lifeExpectancy: shareParams.lifeExpectancy,
        populationMedianAge: shareParams.populationMedianAge,
        isLifeExpectancyCustom: true
      });
    } else if (hadStoredSettingsOnLoad) {
      // 仅当页面加载前 localStorage 已有设置时才恢复结果
      loadAndCalculateFromStorage();
    }
  });

  function handleCalculate(
    birthDate: Date,
    gender: Gender,
    lifeExpectancy: number,
    populationMedianAge: number,
    isLifeExpectancyCustom: boolean
  ) {
    hasCalculatedThisSession = true;

    result = calculateLifePercent({ 
      birthDate, 
      gender, 
      lifeExpectancy, 
      populationMedianAge,
      isLifeExpectancyCustom
    });
  }

  function handleReset() {
    result = null;
    // Clear URL parameters when resetting
    const url = new URL(window.location.href);
    url.search = '';
    window.history.replaceState({}, '', url.toString());
  }

  // ResultSummary when: calculated this session, OR localStorage had settings before load, OR URL has complete params
  $: showResultSummary =
    result !== null && (hasCalculatedThisSession || hadStoredSettingsOnLoad || parseShareParams() !== null);
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
        {$t.app.tagline}
      </p>
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight">
        {$t.app.title}
      </h1>
      <p class="text-base md:text-lg text-neutral-300 light:text-neutral-700 max-w-3xl">
        {$t.app.subtitle}
      </p>
    </header>

    <section class="flex flex-col gap-8 xl:flex-row xl:items-start">
      <div class="flex-1">
        {#if showResultSummary && result}
          <ResultSummary result={result} onReset={handleReset} />
        {:else}
          <InputPanel onCalculate={handleCalculate} />
        {/if}
      </div>

      <aside class="xl:w-72 space-y-4 flex-shrink-0">
        <div class="glass-card rounded-2xl p-6 space-y-3">
          <p class="text-xs uppercase tracking-[0.4em] text-neutral-400 light:text-neutral-500">{$t.app.reminder.title}</p>
          <p class="text-sm text-neutral-200 light:text-neutral-700 leading-relaxed">
            {$t.app.reminder.content}
          </p>
          <div class="text-[0.75rem] text-neutral-400/80 light:text-neutral-500 tracking-[0.3em] uppercase">
            {formatString($t.app.reminder.defaults, { male: DEFAULT_LIFE_EXPECTANCY.male, female: DEFAULT_LIFE_EXPECTANCY.female })}
          </div>
          <div class="h-px bg-white/10 light:bg-black/10" />
          <p class="text-xs text-neutral-400 light:text-neutral-600">
            {$t.app.reminder.note}
          </p>
        </div>

        <div class="glass-card rounded-2xl p-6 space-y-3">
          <p class="text-xs uppercase tracking-[0.4em] text-neutral-400 light:text-neutral-500">{$t.app.cherish.title}</p>
          <p class="text-sm text-neutral-200 light:text-neutral-700 leading-relaxed">
            {$t.app.cherish.content}
          </p>
          <p class="text-sm text-paper-100 light:text-ink-900">
            {$t.app.cherish.conclusion}
          </p>
        </div>
      </aside>
    </section>

    <Footer />
  </div>
</main>
