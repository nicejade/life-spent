<script lang="ts">
  import { locale, SUPPORTED_LOCALES, LOCALE_NAMES, getLocalizedPath, type Locale } from '../helper/i18n';
  import { Listbox, ListboxButton, ListboxOptions, ListboxOption, Transition } from '@rgossiaux/svelte-headlessui';
  import SvgIcon from './SvgIcon.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { trackEvent, GA_EVENTS } from '../helper/ga';

  let selectedLocale: Locale = $locale;
  let unsubscribe: (() => void) | null = null;
  let isUpdatingFromStore = false;

  onMount(() => {
    // Sync with store changes from outside (e.g., URL change)
    unsubscribe = locale.subscribe((value) => {
      if (!isUpdatingFromStore && selectedLocale !== value) {
        selectedLocale = value;
      }
    });
  });

  onDestroy(() => {
    if (unsubscribe) unsubscribe();
  });

  function handleLocaleChange(newLocale: Locale) {
    if (newLocale !== $locale) {
      isUpdatingFromStore = true;
      locale.set(newLocale);
      isUpdatingFromStore = false;
      
      // Track language change
      trackEvent(GA_EVENTS.SELECT_LANGUAGE, {
        language: newLocale,
        previous_language: $locale
      });
      
      // Update URL to reflect new locale
      const currentPath = window.location.pathname;
      const newPath = getLocalizedPath(currentPath, newLocale);
      if (newPath !== currentPath) {
        window.history.replaceState({}, '', newPath);
      }
    }
  }

  // Handle locale change when user selects a new language via Listbox
  $: if (selectedLocale && selectedLocale !== $locale && !isUpdatingFromStore) {
    handleLocaleChange(selectedLocale);
  }
</script>

<div class="relative">
  <Listbox bind:value={selectedLocale} let:open>
    <ListboxButton
      class="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-paper-50 light:text-ink-950 hover:bg-white/10 light:hover:bg-black/10 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-paper-200/50 light:focus-visible:ring-ink-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 light:focus-visible:ring-offset-paper-50"
      aria-label="Select Language"
    >
      <span class="text-sm font-medium min-w-[4rem] text-left">{$locale === 'zh' ? '简体中文' : LOCALE_NAMES[$locale]}</span>
      <SvgIcon name="selector" width={20} height={20} color="currentColor" />
    </ListboxButton>
    {#if open}
      <Transition
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-150 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <ListboxOptions
          static
          class="absolute right-0 mt-2 w-32 rounded-xl bg-ink-950/95 backdrop-blur-md border border-white/20 shadow-xl overflow-hidden z-50 light:bg-white/95 light:border-black/20"
        >
          {#each SUPPORTED_LOCALES as loc}
            <ListboxOption value={loc} let:active let:selected>
              <div
                class="px-4 py-2.5 text-sm transition-colors cursor-pointer {active
                  ? 'bg-white/10 light:bg-black/10'
                  : ''} {selected ? 'text-paper-50 font-medium light:text-ink-950' : 'text-neutral-300 light:text-neutral-600'}"
              >
                <div class="flex items-center justify-between">
                  <span>{LOCALE_NAMES[loc]}</span>
                  {#if selected}
                    <SvgIcon name="check" width={16} height={16} color="currentColor" />
                  {/if}
                </div>
              </div>
            </ListboxOption>
          {/each}
        </ListboxOptions>
      </Transition>
    {/if}
  </Listbox>
</div>
