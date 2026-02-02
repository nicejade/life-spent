<script lang="ts">
  import { calculateLifePercent } from './lib/lifeSpent';
  import InputPanel from './components/InputPanel.svelte';
  import ResultSummary from './components/ResultSummary.svelte';
  import type { Gender, LifeCalculation } from './types/main';

  let result: LifeCalculation | null = null;

  function handleCalculate(birthDate: Date, gender: Gender, medianAge: number) {
    result = calculateLifePercent({ birthDate, gender, medianAge });
  }

  function handleReset() {
    result = null;
  }
</script>

<main class="min-h-screen relative overflow-hidden bg-slate-950 text-slate-100">
  <div class="pointer-events-none absolute inset-0">
    <div class="absolute -top-16 left-1/2 w-[520px] h-[520px] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
    <div class="absolute bottom-0 right-0 w-[360px] h-[360px] bg-amber-500/10 blur-3xl" />
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.2),_transparent_55%)]" />
  </div>

  <div class="relative z-10 container mx-auto px-4 py-12 lg:py-16 space-y-10">
    <header class="max-w-4xl space-y-3 text-center md:text-left">
      <p class="text-xs uppercase tracking-[0.5em] text-amber-400/70">
        LifeSpent · 反思之旅
      </p>
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight">
        透过数据，与生命的流逝保持恰到好处的距离
      </h1>
      <p class="text-base md:text-lg text-slate-300 max-w-3xl">
        以简洁的界面告诉你已走过的岁月，借助中位寿命提醒自己不止于当前的舒适。保持沉静，感受每一次呼吸。
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
          <p class="text-xs uppercase tracking-[0.4em] text-slate-500">提醒</p>
          <p class="text-sm text-slate-200 leading-relaxed">
            中位寿命只是参考，无需恐慌。每一次深呼吸都是对剩余时间的拥抱。
          </p>
          <div class="text-[0.75rem] text-slate-400/80 tracking-[0.3em] uppercase">
            男 73 · 女 79
          </div>
          <div class="h-px bg-amber-500/20" />
          <p class="text-xs text-slate-400">
            如有需要，可在输入面板中自定义中位寿命参考值。
          </p>
        </div>

        <div class="glass-card rounded-2xl p-6 space-y-3">
          <p class="text-xs uppercase tracking-[0.4em] text-slate-500">氛围</p>
          <p class="text-sm text-slate-200 leading-relaxed">
            深色玻璃、细腻的光晕与柔和的金色，让严肃与温柔共存，这就是乔布斯式的典雅。
          </p>
          <p class="text-sm text-amber-300">
            让 UI 成为提醒，而不是额外的干扰。
          </p>
        </div>
      </aside>
    </section>
  </div>

  <footer class="relative z-10 py-8 text-center text-xs text-slate-500">
    <p>仅作提醒，珍惜时间</p>
  </footer>
</main>
