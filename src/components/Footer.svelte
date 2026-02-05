<script lang="ts">
  interface SocialLink {
    href: string;
    img: string;
    alt: string;
  }

  const socialLinks: SocialLink[] = [
    { href: 'https://github.com/nicejade', img: 'github', alt: 'Github' },
    { href: 'https://x.com/MarshalXuan', img: 'x', alt: 'X | Twitter' },
    { href: 'https://www.facebook.com/nice.jade.yang/', img: 'facebook', alt: 'Facebook | 脸书' },
    { href: 'https://www.threads.com/@turingmind', img: 'threads', alt: 'Threads' },
    { href: 'https://www.youtube.com/@MarshalXuan', img: 'youtube', alt: 'YouTube | 油管' },
    { href: 'https://space.bilibili.com/690989854', img: 'bilibili', alt: 'Bilibili | 哔哩哔哩' },
    { href: 'https://mastodon.social/@nicejade', img: 'mastodon', alt: 'Mastodon | 长毛象' },
    { href: 'https://www.jeffjade.com/', img: 'blogger', alt: 'Blog | 博客' },
  ];

  const currentYear = new Date().getFullYear();

  const brandTitle = 'LifeSpent';
  const brandDesc = 'A quiet reflection on time. No judgment, just math.';
</script>

<footer
  class="relative z-10 border-t border-white/[0.08] light:border-black/10 mt-16"
  aria-label="页脚"
>
  <div class="container mx-auto px-4 py-8 md:py-10">
    <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-0">
      <section class="md:w-1/2 w-full flex-shrink-0" aria-labelledby="footer-brand-heading">
        <h2 id="footer-brand-heading" class="sr-only">
          {brandTitle}
        </h2>
        <div class="flex items-center gap-3 mb-2">
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
          {brandDesc}
        </p>
      </section>

      <section class="md:w-1/2 w-full md:text-right text-left md:flex-shrink-0" aria-labelledby="footer-social-heading">
        <h2
          id="footer-social-heading"
          class="text-xs uppercase tracking-[0.4em] text-neutral-400 light:text-neutral-500 mb-4"
        >
          Social | Follow us
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
        LifeSpent · 珍惜此刻
      </p>
      <p class="text-sm text-neutral-500 light:text-neutral-500 font-medium tracking-wide">
          © {currentYear} <a href="https://www.lovejade.cn/" class="text-[var(--sl-color-gray-3)] px-2 py-1 rounded-md transition-all hover:bg-white/[0.1] bg-white/[0.1] [:root[data-theme='light']_&]:hover:bg-black/[0.06] hover:text-[var(--sl-color-text-accent)] decoration-none no-underline border-none">lovejade.cn</a> · 保留所有权利
      </p>
    </div>
  </div>
</footer>
