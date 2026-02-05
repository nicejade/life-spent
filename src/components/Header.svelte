<script lang="ts">
  import { theme } from '../helper/theme';
  import SvgIcon from './SvgIcon.svelte';
  import LanguageSelect from './LanguageSelect.svelte';
  import { trackEvent, GA_EVENTS } from '../helper/ga';
  import { t } from '../helper/i18n';
  import { getLocalizedPath } from '../helper/i18n';

  const GITHUB_URL = 'https://github.com/nicejade/life-spent';

  function toggleTheme() {
    const nextTheme = $theme === 'dark' ? 'light' : 'dark';
    theme.update(() => nextTheme);
    trackEvent(GA_EVENTS.TOGGLE_THEME, { theme: nextTheme });
  }

  function handleNavHome() {
    trackEvent(GA_EVENTS.NAV_HOME);
  }

  function handleNavGithub() {
    trackEvent(GA_EVENTS.NAV_GITHUB);
  }

  function handleNavXFollow() {
    trackEvent(GA_EVENTS.NAV_X_FOLLOW);
  }
</script>

<header
  class="sticky top-0 z-20 w-full bg-transparent"
>
  <div class="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
    <a
      href={getLocalizedPath('/')}
      class="inline-flex items-center gap-2.5 text-paper-50 light:text-ink-950 hover:opacity-90 transition-opacity duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-paper-200/50 light:focus-visible:ring-ink-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 light:focus-visible:ring-offset-paper-50 rounded-lg"
      aria-label={$t.header.homeAriaLabel}
      on:click={handleNavHome}
    >
      <img
        src="/logo.svg"
        alt=""
        width="28"
        height="28"
        class="shrink-0 w-7 h-7 invert light:invert-0"
      />
      <strong class="font-display text-xl font-semibold tracking-tight">
        LifeSpent
      </strong>
    </a>

    <nav class="flex items-center gap-2" aria-label={$t.header.appActions}>
      <div class="relative">
        <LanguageSelect />
      </div>
      <a
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 p-2.5 rounded-xl text-paper-50 light:text-ink-950 hover:bg-white/10 light:hover:bg-black/10 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-paper-200/50 light:focus-visible:ring-ink-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 light:focus-visible:ring-offset-paper-50"
        href="https://x.com/intent/user?screen_name=MarshalXuan"
        title="X | Twitter Follow MarshalXuan"
        aria-label={$t.header.followX}
        on:click={handleNavXFollow}
      >
        {#if $theme === 'dark'}
          <SvgIcon name="x_dark" width={20} height={20} color="currentColor" />
        {:else}
          <SvgIcon name="x" width={20} height={20} color="currentColor" />
        {/if}
      </a>

      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        title="GitHub"
        aria-label={$t.header.viewGithub}
        class="inline-flex items-center gap-1.5 p-2.5 rounded-xl text-paper-50 light:text-ink-950 hover:bg-white/10 light:hover:bg-black/10 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-paper-200/50 light:focus-visible:ring-ink-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 light:focus-visible:ring-offset-paper-50"
        on:click={handleNavGithub}
      >
        <SvgIcon name="github" width={20} height={20} color="currentColor" />
      </a>

      <button
        type="button"
        on:click={toggleTheme}
        class="p-2.5 rounded-xl text-paper-50 light:text-ink-950 hover:bg-white/10 light:hover:bg-black/10 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-paper-200/50 light:focus-visible:ring-ink-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 light:focus-visible:ring-offset-paper-50"
        aria-label={$t.header.toggleTheme}
        title={$t.header.toggleTheme}
      >
        {#if $theme === 'dark'}
          <SvgIcon name="sun" width={20} height={20} color="currentColor" />
        {:else}
          <SvgIcon name="moon" width={20} height={20} color="currentColor" />
        {/if}
      </button>
    </nav>
  </div>
</header>
