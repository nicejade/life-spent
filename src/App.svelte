<script lang="ts">
  import type { Gender } from './lib/types';
  import type { LifeCalculation } from './lib/types';
  import { calculateLifePercent } from './lib/lifePercent';
  import InputPanel from './components/InputPanel.svelte';
  import ResultSummary from './components/ResultSummary.svelte';

  let result: LifeCalculation | null = null;

  function handleCalculate(birthDate: Date, gender: Gender) {
    result = calculateLifePercent({ birthDate, gender });
  }

  function handleReset() {
    result = null;
  }
</script>

<main class="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
  <div class="container mx-auto flex flex-col items-center">
    {#if result === null}
      <InputPanel onCalculate={handleCalculate} />
    {:else}
      <ResultSummary result={result} onReset={handleReset} />
    {/if}
  </div>

  <footer class="absolute bottom-4 text-xs text-slate-600">
    <p>仅作提醒，珍惜时间</p>
  </footer>
</main>
