<script lang="ts">
  import { t, formatString } from '../helper/i18n';
  import { trackEvent, GA_EVENTS } from '../helper/ga';

  interface SocialLink {
    href: string;
    img: string;
    alt: string;
  }

  const socialLinks: SocialLink[] = [
    { href: 'https://github.com/nicejade', img: 'github', alt: 'Github' },
    { href: 'https://x.com/MarshalXuan', img: 'x', alt: 'X | Twitter' },
    { href: 'https://www.facebook.com/nice.jade.yang/', img: 'facebook', alt: 'Facebook' },
    { href: 'https://www.threads.com/@turingmind', img: 'threads', alt: 'Threads' },
    { href: 'https://www.youtube.com/@MarshalXuan', img: 'youtube', alt: 'YouTube' },
    { href: 'https://space.bilibili.com/690989854', img: 'bilibili', alt: 'Bilibili' },
    { href: 'https://mastodon.social/@nicejade', img: 'mastodon', alt: 'Mastodon' },
    { href: 'https://www.jeffjade.com/', img: 'blogger', alt: 'Blog' },
  ];

  const socialEventMap: Record<string, string> = {
    'Github': GA_EVENTS.NAV_GITHUB,
    'X | Twitter': GA_EVENTS.NAV_X_FOLLOW,
    'Facebook': GA_EVENTS.NAV_FACEBOOK,
    'Threads': GA_EVENTS.NAV_THREADS,
    'YouTube': GA_EVENTS.NAV_YOUTUBE,
    'Bilibili': GA_EVENTS.NAV_BILIBILI,
    'Mastodon': GA_EVENTS.NAV_MASTODON,
    'Blog': GA_EVENTS.NAV_BLOGGER,
  };

  function handleSocialClick(link: SocialLink) {
    const eventName = socialEventMap[link.alt];
    if (!eventName) return;

    trackEvent(eventName, {
      platform: link.alt,
      url: link.href,
    });
  }

  const currentYear = new Date().getFullYear();

  const brandTitle = 'LifeSpent';
</script>

<footer
  class="relative z-10 border-t border-white/[0.08] light:border-black/10 mt-16"
  aria-label="Footer"
>
  <div class="container mx-auto px-4 py-8 md:py-10">
    <div class="flex flex-col md:space-y-0 space-y-4 md:flex-row md:items-start md:justify-between gap-0">
      <section class="md:w-1/2 w-full flex-shrink-0" aria-labelledby="footer-brand-heading">
        <h2 id="footer-brand-heading" class="sr-only">
          {brandTitle}
        </h2>
        <div class="flex items-center gap-3 md:mb-2 mb-0">
          <span
            class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 light:bg-black/5 text-paper-50 light:text-ink-950"
            aria-hidden="true"
          >
            <img
              src="/logo.svg"
              alt=""
              width="20"
              height="20"
              class="w-5 h-5 pointer-events-none invert light:invert-0"
            />
          </span>
          <span class="text-base font-medium text-paper-50 light:text-ink-950 tracking-tight">
            {brandTitle}
          </span>
        </div>
        <p class="text-sm text-neutral-400 light:text-neutral-600 pl-[3.25rem] leading-relaxed">
          {$t.footer.brandDesc}
        </p>
      </section>

      <section class="md:w-1/2 w-full md:text-right text-left md:flex-shrink-0" aria-labelledby="footer-social-heading">
        <h2
          id="footer-social-heading"
          class="text-sm uppercase tracking-[0.4em] text-neutral-400 light:text-neutral-500 mb-2 md:mb-4"
        >
          {$t.footer.socialTitle}
        </h2>
        <ul class="flex flex-wrap gap-2 md:justify-end justify-start" role="list">
        {#each socialLinks as link}
          <li>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              title={link.alt}
              aria-label={link.alt}
              class="inline-flex items-center justify-center w-10 h-10 rounded-xl text-paper-50 light:text-ink-950 hover:bg-white/10 light:hover:bg-black/10 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-paper-200/50 light:focus-visible:ring-ink-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 light:focus-visible:ring-offset-paper-50"
              on:click={() => handleSocialClick(link)}
            >
              <img
                src="/svgs/{link.img}.svg"
                alt=""
                width="20"
                height="20"
                class="w-5 h-5 pointer-events-none invert light:invert-0"
              />
            </a>
          </li>
        {/each}
      </ul>
      </section>
    </div>

    <div
      class="mt-8 pt-6 border-t border-white/[0.06] light:border-black/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
    >
      <p class="text-sm text-neutral-400 light:text-neutral-600">
        {$t.footer.tagline}
      </p>
      <p class="text-sm text-neutral-500 light:text-neutral-500 font-medium tracking-wide">
          {formatString('© {year}', { year: String(currentYear) })} <a href="https://www.lovejade.cn/" class="text-[var(--sl-color-gray-3)] px-2 py-1 rounded-md transition-all hover:bg-white/[0.1] bg-white/[0.1] [:root[data-theme='light']_&]:hover:bg-black/[0.06] hover:text-[var(--sl-color-text-accent)] decoration-none no-underline border-none">lovejade.cn</a> · {$t.footer.allRightsReserved}
      </p>
    </div>
  </div>
</footer>
