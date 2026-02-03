<script lang="ts">
  import { DEFAULT_LIFE_EXPECTANCY, DEFAULT_POPULATION_MEDIAN_AGE, validateBirthDate } from '../helper/lifeSpent';
  import CustomSelect from './Select.svelte';
  import { 
    STORAGE_KEY,
    MIN_YEAR,
    DEFAULT_BIRTH_YEAR,
    DEFAULT_BIRTH_MONTH,
    DEFAULT_BIRTH_DAY,
    POPULATION_MEDIAN_AGE_MIN,
    POPULATION_MEDIAN_AGE_MAX,
    LIFE_EXPECTANCY_MIN,
    LIFE_EXPECTANCY_MAX
  } from '../helper/constant';
  import type { Gender, SelectItem } from '../types/main';

  interface StoredSettings {
    selectedYear: string;
    selectedMonth: string;
    selectedDay: string;
    gender: Gender;
    lifeExpectancyInput: string;
    populationMedianAgeInput: string;
  }

  function loadSettings(): StoredSettings | null {
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

  function saveSettings(settings: StoredSettings): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore storage errors
    }
  }


  function sanitizeNumericInput(value: string) {
    let cleaned = value.replace(/[^0-9.]/g, '');
    
    // 限制只能有一个小数点
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      cleaned = parts[0] + '.' + parts.slice(1).join('');
    }
    
    if (parts[1] && parts[1].length > 2) {
      cleaned = parts[0] + '.' + parts[1].slice(0, 2);
    }
    
    return cleaned;
  }

  function handleLifeExpectancyInput(e: Event) {
    const input = e.target as HTMLInputElement;
    lifeExpectancyInput = sanitizeNumericInput(input.value);
  }

  function handlePopulationMedianAgeInput(e: Event) {
    const input = e.target as HTMLInputElement;
    populationMedianAgeInput = sanitizeNumericInput(input.value);
  }

  function getLifeExpectancy(): number {
    const parsed = parseFloat(lifeExpectancyInput);
    if (isNaN(parsed) || parsed < 0) {
      return DEFAULT_LIFE_EXPECTANCY[gender];
    }
    // 限制在有效范围内
    return Math.max(LIFE_EXPECTANCY_MIN, Math.min(LIFE_EXPECTANCY_MAX, parsed));
  }

  function getPopulationMedianAge(): number {
    const parsed = parseFloat(populationMedianAgeInput);
    if (isNaN(parsed) || parsed < 0) {
      return DEFAULT_POPULATION_MEDIAN_AGE;
    }
    // 限制在有效范围内
    return Math.max(POPULATION_MEDIAN_AGE_MIN, Math.min(POPULATION_MEDIAN_AGE_MAX, parsed));
  }

  export let onCalculate: (
    birthDate: Date,
    gender: Gender,
    lifeExpectancy: number,
    populationMedianAge: number
  ) => void;

  const currentYear = new Date().getFullYear();

  function pad(n: number): string {
    return String(n).padStart(2, '0');
  }

  function daysInMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
  }

  const yearOptions: SelectItem[] = Array.from(
    { length: currentYear - MIN_YEAR + 1 },
    (_, i) => {
      const y = currentYear - i;
      return { name: String(y), value: String(y) };
    }
  );

  const monthOptions: SelectItem[] = Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    return { name: `${pad(m)} 月`, value: String(m) };
  });

  const LIFE_EXPECTANCY_DEFAULT_MALE = DEFAULT_LIFE_EXPECTANCY.male;
  const LIFE_EXPECTANCY_DEFAULT_FEMALE = DEFAULT_LIFE_EXPECTANCY.female;
  const NUMERIC_PATTERN = '[0-9]*\\.?[0-9]{0,2}';

  function getInitialSettings(): StoredSettings {
    const saved = loadSettings();
    if (saved) {
      const g = saved.gender || 'male';
      return {
        selectedYear: saved.selectedYear || DEFAULT_BIRTH_YEAR,
        selectedMonth: saved.selectedMonth || DEFAULT_BIRTH_MONTH,
        selectedDay: saved.selectedDay || DEFAULT_BIRTH_DAY,
        gender: g,
        lifeExpectancyInput: saved.lifeExpectancyInput ?? String(DEFAULT_LIFE_EXPECTANCY[g]),
        populationMedianAgeInput: saved.populationMedianAgeInput ?? String(DEFAULT_POPULATION_MEDIAN_AGE),
      };
    }
    return {
      selectedYear: DEFAULT_BIRTH_YEAR,
      selectedMonth: DEFAULT_BIRTH_MONTH,
      selectedDay: DEFAULT_BIRTH_DAY,
      gender: 'male',
      lifeExpectancyInput: String(DEFAULT_LIFE_EXPECTANCY.male),
      populationMedianAgeInput: String(DEFAULT_POPULATION_MEDIAN_AGE),
    };
  }

  const initial = getInitialSettings();
  let selectedYear = initial.selectedYear;
  let selectedMonth = initial.selectedMonth;
  let selectedDay = initial.selectedDay;
  let gender: Gender = initial.gender;
  let lifeExpectancyInput = initial.lifeExpectancyInput;
  let populationMedianAgeInput = initial.populationMedianAgeInput;

  $: dayOptions = (() => {
    const y = parseInt(selectedYear, 10) || currentYear;
    const m = parseInt(selectedMonth, 10) || 1;
    const maxDay = daysInMonth(y, m);
    const day = parseInt(selectedDay, 10) || 1;
    if (day > maxDay) selectedDay = String(maxDay);
    return Array.from({ length: maxDay }, (_, i) => {
      const d = i + 1;
      return { name: pad(d), value: String(d) };
    });
  })() as SelectItem[];

  $: birthDateStr = `${selectedYear}-${pad(parseInt(selectedMonth, 10) || 1)}-${pad(parseInt(selectedDay, 10) || 1)}`;

  $: yearActive = Math.max(0, yearOptions.findIndex((o) => o.value === selectedYear));
  $: monthActive = Math.max(0, monthOptions.findIndex((o) => o.value === selectedMonth));
  $: dayActive = Math.max(0, dayOptions.findIndex((o) => o.value === selectedDay));

  let error = '';

  // 根据性别设置默认平均预期寿命输入值
  $: if (gender === 'male' && lifeExpectancyInput === String(LIFE_EXPECTANCY_DEFAULT_FEMALE)) {
    lifeExpectancyInput = String(LIFE_EXPECTANCY_DEFAULT_MALE);
  } else if (gender === 'female' && lifeExpectancyInput === String(LIFE_EXPECTANCY_DEFAULT_MALE)) {
    lifeExpectancyInput = String(LIFE_EXPECTANCY_DEFAULT_FEMALE);
  }

  $: saveSettings({
    selectedYear,
    selectedMonth,
    selectedDay,
    gender,
    lifeExpectancyInput,
    populationMedianAgeInput
  });

  function handleYearSelect(e: CustomEvent<SelectItem>) {
    selectedYear = e.detail?.value ?? selectedYear;
  }

  function handleMonthSelect(e: CustomEvent<SelectItem>) {
    selectedMonth = e.detail?.value ?? selectedMonth;
  }

  function handleDaySelect(e: CustomEvent<SelectItem>) {
    selectedDay = e.detail?.value ?? selectedDay;
  }

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

    const lifeExpectancy = getLifeExpectancy();
    const populationMedianAge = getPopulationMedianAge();

    // 验证输入值是否在有效范围内
    const lifeExpectancyValue = parseFloat(lifeExpectancyInput);
    if (!isNaN(lifeExpectancyValue)) {
      if (lifeExpectancyValue < LIFE_EXPECTANCY_MIN || lifeExpectancyValue > LIFE_EXPECTANCY_MAX) {
        error = `平均预期寿命应在 ${LIFE_EXPECTANCY_MIN} 到 ${LIFE_EXPECTANCY_MAX} 岁之间`;
        return;
      }
    }

    const medianAgeValue = parseFloat(populationMedianAgeInput);
    if (!isNaN(medianAgeValue)) {
      if (medianAgeValue < POPULATION_MEDIAN_AGE_MIN || medianAgeValue > POPULATION_MEDIAN_AGE_MAX) {
        error = `人口中位年龄应在 ${POPULATION_MEDIAN_AGE_MIN} 到 ${POPULATION_MEDIAN_AGE_MAX} 岁之间`;
        return;
      }
    }

    onCalculate(birthDate, gender, lifeExpectancy, populationMedianAge);
  }
</script>

<div class="glass-card rounded-2xl p-8 md:p-12 max-w-lg w-full space-y-6">
  <div class="space-y-2">
    <h1 class="text-3xl md:text-4xl font-light text-slate-100">
      人生已度过
    </h1>
      <p class="text-sm text-slate-400">
      用数学告诉你时间的真相，静默但不沉闷。
      </p>
    </div>

  <form on:submit|preventDefault={handleSubmit} class="space-y-6">
    <div class="space-y-2" role="group" aria-labelledby="birthdate-label">
      <p id="birthdate-label" class="block text-sm font-medium text-slate-300">
        出生日期
      </p>
      <div
        class="grid grid-cols-3 gap-3"
        aria-required="true"
        aria-invalid={error ? 'true' : 'false'}
      >
        <CustomSelect
          options={yearOptions}
          active={yearActive}
          label="年"
          listboxClass="w-full min-w-0"
          on:selected={handleYearSelect}
        />
        <CustomSelect
          options={monthOptions}
          active={monthActive}
          label="月"
          listboxClass="w-full min-w-0"
          on:selected={handleMonthSelect}
        />
        <CustomSelect
          options={dayOptions}
          active={dayActive}
          label="日"
          listboxClass="w-full min-w-0"
          on:selected={handleDaySelect}
        />
      </div>
    </div>

    <fieldset class="space-y-3 border-0 p-0">
      <legend class="text-sm font-medium text-slate-300">
        选择性别
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
      <p class="text-sm font-medium text-slate-300">
        平均预期寿命
      </p>
      <div class="flex items-center gap-2">
        <input
          type="number"
          inputmode="decimal"
          pattern={NUMERIC_PATTERN}
          value={lifeExpectancyInput}
          on:input={handleLifeExpectancyInput}
          class="w-32 px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl
                 text-slate-200 text-center transition-all
                 focus:border-amber-400 focus:outline-none focus:bg-slate-950/70"
          aria-label="平均预期寿命（可输入小数）"
        />
        <span class="text-slate-400">岁</span>
      </div>
      <p class="text-xs text-slate-500">
        不同国家和地区的预期寿命存在差异，可根据实际情况调整
      </p>
    </div>

    <div class="space-y-2">
      <p class="text-sm font-medium text-slate-300">
        人口中位年龄
      </p>
      <div class="flex items-center gap-2">
        <input
          type="number"
          inputmode="decimal"
          pattern={NUMERIC_PATTERN}
          value={populationMedianAgeInput}
          on:input={handlePopulationMedianAgeInput}
          class="w-32 px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl
                 text-slate-200 text-center transition-all
                 focus:border-amber-400 focus:outline-none focus:bg-slate-950/70"
          aria-label="人口中位年龄（可输入小数）"
        />
        <span class="text-slate-400">岁</span>
      </div>
      <p class="text-xs text-slate-500">
        默认值为中国人口中位年龄 39.6 岁，可根据所在国家调整
      </p>
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
    默认参考值：平均预期寿命 男性 73 岁，女性 79 岁 · 人口中位年龄 39.6 岁
  </p>
</div>
