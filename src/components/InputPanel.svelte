<script lang="ts">
  import type { Gender } from '../lib/types';
  import { validateBirthDate } from '../lib/lifePercent';

  export let onCalculate: (birthDate: Date, gender: Gender) => void;

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
</script>

<div class="glass-card rounded-2xl p-8 md:p-12 max-w-lg w-full">
  <h1 class="text-3xl md:text-4xl font-light mb-2 text-slate-100">
    人生已度过
  </h1>
  <p class="text-sm md:text-base text-slate-400 mb-8">
    用数学告诉你时间的真相
  </p>

  <form on:submit|preventDefault={handleSubmit} class="space-y-6">
    <div>
      <label for="birthdate" class="block text-sm font-medium text-slate-300 mb-2">
        出生日期
      </label>
      <input
        id="birthdate"
        type="date"
        bind:value={birthDateStr}
        class="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl
               text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 
               focus:border-amber-500 transition-all cursor-pointer"
        aria-required="true"
        aria-invalid={error ? 'true' : 'false'}
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-slate-300 mb-3">
        性别
      </label>
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
                      text-center transition-all peer-checked:border-amber-500 
                      peer-checked:bg-amber-500/10 peer-checked:text-amber-400">
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
                      text-center transition-all peer-checked:border-amber-500 
                      peer-checked:bg-amber-500/10 peer-checked:text-amber-400">
            女性
          </div>
        </label>
      </div>
    </div>

    {#if error}
      <div class="text-sm text-red-400 bg-red-500/10 border border-red-500/20 
                  rounded-lg px-4 py-2" role="alert">
        {error}
      </div>
    {/if}

    <button
      type="submit"
      class="w-full px-6 py-4 bg-amber-500/20 hover:bg-amber-500/30 
             border border-amber-500/40 hover:border-amber-500/60
             text-amber-400 rounded-xl font-medium transition-all
             cursor-pointer active:scale-[0.98]"
      aria-label="计算人生已度过的百分比"
    >
      查看真相
    </button>
  </form>

  <p class="text-xs text-slate-500 mt-6 text-center">
    数据基于中位寿命：男性 73 岁，女性 79 岁
  </p>
</div>
