<script lang="ts">
  import type { Gender } from '../lib/types';
  import { validateBirthDate } from '../lib/lifePercent';

  export let onCalculate: (birthDate: Date, gender: Gender) => void;

  const quickAges = [25, 32, 40, 50];

  let birthDateStr = '';
  let gender: Gender = 'male';
  let error = '';

  function handleSubmit() {
    error = '';

    if (!birthDateStr) {
      error = '请输入出生日期';
      return;
    }

    const birthDate = new Date(birthDateStr);

    if (isNaN(birthDate.getTime())) {
      error = '日期格式无效';
      return;
    }

    if (!validateBirthDate(birthDate)) {
      error = '请输入有效的出生日期';
      return;
    }

    onCalculate(birthDate, gender);
  }

  function applyQuickAge(age: number) {
    const today = new Date();
    const candidate = new Date(today.getFullYear() - age, today.getMonth(), today.getDate());
    birthDateStr = candidate.toISOString().slice(0, 10);
    error = '';
  }
</script>

<div class="glass-card rounded-2xl p-8 md:p-12 max-w-lg w-full space-y-6">
  <div class="space-y-2">
    <p class="text-sm uppercase tracking-[0.4em] text-amber-400/80">镜面</p>
    <h1 class="text-3xl md:text-4xl font-light text-slate-100">
      人生已度过
    </h1>
    <p class="text-sm text-slate-400">
      用数学告诉你时间的真相，静默但不沉闷。
    </p>
  </div>

  <form on:submit|preventDefault={handleSubmit} class="space-y-6">
    <div class="space-y-2">
      <label for="birthdate" class="block text-sm font-medium text-slate-300">
        出生日期
      </label>
      <input
        id="birthdate"
        type="date"
        bind:value={birthDateStr}
        class="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl
               text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400/60
               focus:border-amber-400 transition-all cursor-pointer"
        aria-required="true"
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby="birthdate-help"
      />
      <p id="birthdate-help" class="text-xs text-slate-500">
        也可以直接粘贴 <kbd class="px-2 py-1 bg-slate-900 rounded">YYYY-MM-DD</kbd> 格式.
      </p>
    </div>

    <fieldset class="space-y-3 border-0 p-0">
      <legend class="text-sm font-medium text-slate-300">
        性别
      </legend>
      <div class="flex gap-4">
        <label class="flex-1 cursor-pointer">
          <input
            type="radio"
            name="gender"
            value="male"
            bind:group={gender}
            class="sr-only peer"
            aria-label="男性"
          />
          <div class="px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl
                      text-center transition-all peer-checked:border-amber-400 
                      peer-checked:bg-amber-500/10 peer-checked:text-amber-300">
            男性
          </div>
        </label>
        <label class="flex-1 cursor-pointer">
          <input
            type="radio"
            name="gender"
            value="female"
            bind:group={gender}
            class="sr-only peer"
            aria-label="女性"
          />
          <div class="px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl
                      text-center transition-all peer-checked:border-amber-400 
                      peer-checked:bg-amber-500/10 peer-checked:text-amber-300">
            女性
          </div>
        </label>
      </div>
    </fieldset>

    <div class="space-y-2">
      <p class="text-xs uppercase tracking-[0.4em] text-slate-500">快速选择</p>
      <div class="grid grid-cols-2 gap-3 text-[0.65rem] tracking-[0.3em] uppercase">
        {#each quickAges as age}
          <button
            type="button"
            on:click={() => applyQuickAge(age)}
            class="px-3 py-2 bg-slate-800/70 border border-slate-700 rounded-xl
                   text-slate-200 transition-colors duration-200 hover:border-amber-400
                   hover:text-amber-300 focus-visible:outline focus-visible:outline-2
                   focus-visible:outline-offset-2 focus-visible:outline-amber-400 cursor-pointer"
          >
            {age} 岁
          </button>
        {/each}
      </div>
    </div>

    {#if error}
      <div
        class="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2"
        role="alert"
        aria-live="assertive"
      >
        {error}
      </div>
    {/if}

    <button
      type="submit"
      class="w-full px-6 py-4 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40
             hover:border-amber-500/70 text-amber-400 rounded-xl font-medium transition-all
             cursor-pointer active:scale-[0.98]"
      aria-label="计算人生已度过的百分比"
    >
      查看真相
    </button>
  </form>

  <p class="text-xs text-slate-500 mt-1 text-center">
    数据基于中位寿命：男性 73 岁，女性 79 岁
  </p>
</div>
