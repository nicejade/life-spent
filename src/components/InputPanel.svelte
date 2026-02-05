<script lang="ts">
  import { validateBirthDate } from '../helper/lifeSpent';
  import CustomSelect from './Select.svelte';
  import { 
    STORAGE_KEY,
    MIN_YEAR,
    DEFAULT_BIRTH_YEAR,
    DEFAULT_BIRTH_MONTH,
    DEFAULT_BIRTH_DAY,
    POPULATION_MEDIAN_AGE_MIN,
    POPULATION_MEDIAN_AGE_MAX,
    DEFAULT_POPULATION_MEDIAN_AGE,
    LIFE_EXPECTANCY_MIN,
    LIFE_EXPECTANCY_MAX,
    DEFAULT_LIFE_EXPECTANCY,
  } from '../helper/constant';
  import type { Gender, SelectItem } from '../types/main';
  import { trackEvent, GA_EVENTS } from '../helper/ga';
  import { t, formatString, locale, LOCALE_TO_INTL } from '../helper/i18n';

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
    
    // Allow only one decimal point
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
    // Clamp to valid range
    return Math.max(LIFE_EXPECTANCY_MIN, Math.min(LIFE_EXPECTANCY_MAX, parsed));
  }

  function getPopulationMedianAge(): number {
    const parsed = parseFloat(populationMedianAgeInput);
    if (isNaN(parsed) || parsed < 0) {
      return DEFAULT_POPULATION_MEDIAN_AGE;
    }
    // Clamp to valid range
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

  function getMonthName(month: number): string {
    const currentLocale = $locale;
    const intlLocale = LOCALE_TO_INTL[currentLocale];
    const date = new Date(2000, month - 1, 1);
    return date.toLocaleDateString(intlLocale, { month: 'long' });
  }

  $: monthOptions = Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    return { name: getMonthName(m), value: String(m) };
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

  // Update default life expectancy based on gender
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
    trackEvent(GA_EVENTS.SELECT_YEAR, {
      value: selectedYear,
    });
  }

  function handleMonthSelect(e: CustomEvent<SelectItem>) {
    selectedMonth = e.detail?.value ?? selectedMonth;
    trackEvent(GA_EVENTS.SELECT_MONTH, {
      value: selectedMonth,
    });
  }

  function handleDaySelect(e: CustomEvent<SelectItem>) {
    selectedDay = e.detail?.value ?? selectedDay;
    trackEvent(GA_EVENTS.SELECT_DAY, {
      value: selectedDay,
    });
  }

  function handleGenderChange(newGender: Gender) {
    gender = newGender;
    trackEvent(GA_EVENTS.SELECT_GENDER, {
      gender: newGender,
    });
  }

  function handleSubmit() {
    error = '';

    if (!birthDateStr) {
      error = $t.inputPanel.errors.enterBirthDate;
      return;
    }

    const birthDate = new Date(birthDateStr);

    if (isNaN(birthDate.getTime())) {
      error = $t.inputPanel.errors.invalidDate;
      return;
    }

    if (!validateBirthDate(birthDate)) {
      error = $t.inputPanel.errors.invalidBirthDate;
      return;
    }

    const lifeExpectancy = getLifeExpectancy();
    const populationMedianAge = getPopulationMedianAge();

    // Validate input values are within valid range
    const lifeExpectancyValue = parseFloat(lifeExpectancyInput);
    if (!isNaN(lifeExpectancyValue)) {
      if (lifeExpectancyValue < LIFE_EXPECTANCY_MIN || lifeExpectancyValue > LIFE_EXPECTANCY_MAX) {
        error = formatString($t.inputPanel.errors.lifeExpectancyRange, { min: String(LIFE_EXPECTANCY_MIN), max: String(LIFE_EXPECTANCY_MAX) });
        return;
      }
    }

    const medianAgeValue = parseFloat(populationMedianAgeInput);
    if (!isNaN(medianAgeValue)) {
      if (medianAgeValue < POPULATION_MEDIAN_AGE_MIN || medianAgeValue > POPULATION_MEDIAN_AGE_MAX) {
        error = formatString($t.inputPanel.errors.medianAgeRange, { min: String(POPULATION_MEDIAN_AGE_MIN), max: String(POPULATION_MEDIAN_AGE_MAX) });
        return;
      }
    }

    // Track calculate event
    trackEvent(GA_EVENTS.SUBMIT_CALCULATE, {
      birth_date: birthDateStr,
      gender: gender,
      life_expectancy: lifeExpectancy,
      population_median_age: populationMedianAge,
    });

    onCalculate(birthDate, gender, lifeExpectancy, populationMedianAge);
  }
</script>

<div class="glass-card rounded-2xl p-8 md:p-12 max-w-xl w-full space-y-6">
  <div class="space-y-2">
    <h1 class="text-3xl md:text-4xl font-light text-paper-50 light:text-ink-950">
      {$t.inputPanel.title}
    </h1>
      <p class="text-sm text-neutral-400 light:text-neutral-600">
      {$t.inputPanel.subtitle}
      </p>
    </div>

  <form on:submit|preventDefault={handleSubmit} class="space-y-6">
    <div class="space-y-2" role="group" aria-labelledby="birthdate-label">
      <p id="birthdate-label" class="block text-sm font-medium text-neutral-300 light:text-neutral-700">
        {$t.inputPanel.birthDateLabel}
      </p>
      <div
        class="grid grid-cols-1 sm:grid-cols-3 gap-3"
        aria-required="true"
        aria-invalid={error ? 'true' : 'false'}
      >
        <CustomSelect
          options={yearOptions}
          active={yearActive}
          label={$t.inputPanel.year}
          listboxClass="w-full min-w-0"
          on:selected={handleYearSelect}
        />
        <CustomSelect
          options={monthOptions}
          active={monthActive}
          label={$t.inputPanel.month}
          listboxClass="w-full min-w-0"
          on:selected={handleMonthSelect}
        />
        <CustomSelect
          options={dayOptions}
          active={dayActive}
          label={$t.inputPanel.day}
          listboxClass="w-full min-w-0"
          on:selected={handleDaySelect}
        />
      </div>
    </div>

    <fieldset class="space-y-3 border-0 p-0">
      <legend class="text-sm font-medium text-neutral-300 light:text-neutral-700">
        {$t.inputPanel.selectGender}
      </legend>
      <div class="flex gap-4">
        <label class="flex-1 cursor-pointer">
          <input
            type="radio"
            name="gender"
            value="male"
            bind:group={gender}
            class="sr-only peer"
            aria-label={$t.inputPanel.male}
            on:change={() => handleGenderChange('male')}
          />
          <div class="px-4 py-3 bg-white/5 border border-white/10 rounded-xl
                      text-center transition-all peer-checked:border-paper-200/60 
                      peer-checked:bg-white/10 peer-checked:text-paper-50
                      light:bg-black/5 light:border-black/10 light:text-ink-700
                      light:peer-checked:bg-black/10 light:peer-checked:text-ink-950">
            {$t.inputPanel.male}
          </div>
        </label>
        <label class="flex-1 cursor-pointer">
          <input
            type="radio"
            name="gender"
            value="female"
            bind:group={gender}
            class="sr-only peer"
            aria-label={$t.inputPanel.female}
            on:change={() => handleGenderChange('female')}
          />
          <div class="px-4 py-3 bg-white/5 border border-white/10 rounded-xl
                      text-center transition-all peer-checked:border-paper-200/60 
                      peer-checked:bg-white/10 peer-checked:text-paper-50
                      light:bg-black/5 light:border-black/10 light:text-ink-700
                      light:peer-checked:bg-black/10 light:peer-checked:text-ink-950">
            {$t.inputPanel.female}
          </div>
        </label>
      </div>
    </fieldset>

    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div class="w-full md:w-auto space-y-2">
        <p class="text-sm font-medium text-neutral-300 light:text-neutral-700">
          {$t.inputPanel.lifeExpectancy}
        </p>
        <div class="flex items-center gap-2">
          <input
            type="text"
            inputmode="decimal"
            pattern={NUMERIC_PATTERN}
            value={lifeExpectancyInput}
            on:input={handleLifeExpectancyInput}
            class="md:w-32 w-56 px-4 py-3 bg-white/5 border border-white/10 rounded-xl
                  text-paper-50 text-center transition-all
                  focus:border-paper-200/70 focus:outline-none focus:bg-white/10
                  light:bg-black/5 light:border-black/10 light:text-ink-950
                  light:focus:border-black/20 light:focus:bg-black/10"
            aria-label={$t.inputPanel.lifeExpectancy}
          />
          <span class="text-neutral-400 light:text-neutral-600">{$t.inputPanel.yearsOld}</span>
        </div>
      </div>

      <div class="w-full md:w-auto space-y-2">
        <p class="text-sm font-medium text-neutral-300 light:text-neutral-700">
          {$t.inputPanel.populationMedianAge}
        </p>
        <div class="flex items-center gap-2">
          <input
            type="text"
            inputmode="decimal"
            pattern={NUMERIC_PATTERN}
            value={populationMedianAgeInput}
            on:input={handlePopulationMedianAgeInput}
            class="md:w-32 w-56 px-4 py-3 bg-white/5 border border-white/10 rounded-xl
                  text-paper-50 text-center transition-all
                  focus:border-paper-200/70 focus:outline-none focus:bg-white/10
                  light:bg-black/5 light:border-black/10 light:text-ink-950
                  light:focus:border-black/20 light:focus:bg-black/10"
            aria-label={$t.inputPanel.populationMedianAge}
          />
          <span class="text-neutral-400 light:text-neutral-600">{$t.inputPanel.yearsOld}</span>
        </div>
      </div>
    </div>
    <p class="text-xs text-neutral-500 light:text-neutral-600">
      {$t.inputPanel.customNote}
    </p>

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
      class="w-full px-6 py-4 bg-paper-50/95 hover:bg-paper-100 border border-paper-100/70
             hover:border-paper-200 text-ink-950 rounded-xl font-medium transition-all
             light:bg-ink-950 light:text-paper-50 light:border-ink-900 light:hover:bg-ink-900
             cursor-pointer active:scale-[0.98]"
      aria-label={$t.inputPanel.submitButton}
    >
      {$t.inputPanel.submitButton}
    </button>
  </form>

  <p class="text-xs text-neutral-500 light:text-neutral-600 mt-1 text-left">
    {formatString($t.inputPanel.defaultNote, { male: String(DEFAULT_LIFE_EXPECTANCY.male), female: String(DEFAULT_LIFE_EXPECTANCY.female), median: String(DEFAULT_POPULATION_MEDIAN_AGE) })}
  </p>
</div>
