export type Locale = 'zh' | 'zh-TW' | 'en' | 'ja' | 'fr' | 'ru' | 'th';

export interface Translations {
  // App.svelte
  app: {
    tagline: string;
    title: string;
    subtitle: string;
    /** Full document title for <title>, og:title, twitter:title (SEO / GEO / AEO). */
    documentTitle: string;
    /** Meta description for meta name="description", og:description, twitter:description. */
    metaDescription: string;
    reminder: {
      title: string;
      content: string;
      defaults: string;
      note: string;
    };
    cherish: {
      title: string;
      content: string;
      conclusion: string;
    };
  };
  
  // Header.svelte
  header: {
    homeAriaLabel: string;
    appActions: string;
    followX: string;
    viewGithub: string;
    toggleTheme: string;
  };
  
  // Footer.svelte
  footer: {
    brandDesc: string;
    socialTitle: string;
    tagline: string;
    allRightsReserved: string;
  };
  
  // InputPanel.svelte
  inputPanel: {
    title: string;
    subtitle: string;
    birthDateLabel: string;
    year: string;
    month: string;
    day: string;
    selectGender: string;
    male: string;
    female: string;
    lifeExpectancy: string;
    populationMedianAge: string;
    yearsOld: string;
    customNote: string;
    submitButton: string;
    defaultNote: string;
    errors: {
      enterBirthDate: string;
      invalidDate: string;
      invalidBirthDate: string;
      lifeExpectancyRange: string;
      medianAgeRange: string;
    };
  };
  
  // ResultSummary.svelte
  resultSummary: {
    relativeAgePosition: string;
    relativeAgeQuestion: string;
    percentSpent: string;
    remaining: string;
    referenceNote: string;
    impactViews: string;
    viewGrid: string;
    viewStrata: string;
    viewWeeks: string;
    viewHeartbeat: string;
    birthDate: string;
    currentAge: string;
    lifeExpectancy: string;
    yearsRemaining: string;
    populationMedianAge: string;
    relativeAgePercent: string;
    relativeAge: string;
    medianGapBefore: string;
    medianGapAfter: string;
    medianGapNote: string;
    expectancyGapBefore: string;
    expectancyGapReached: string;
    expectancyGapNote: string;
    reflectionTitle: string;
    reflectionContent: string;
    reflectionConclusion: string;
    shareLink: string;
    copied: string;
    copyImage: string;
    copyImageBusy: string;
    copyImageDone: string;
    copyImageFailed: string;
    shareToTwitter: string;
    shareToFacebook: string;
    shareText: string;
    shareTitle: string;
    reset: string;
  };
  
  // Impact components
  impact: {
    weeksWall: {
      title: string;
      ariaLabel: string;
      weekRange: string;
      summary: string;
    };
    gridAges: {
      title: string;
      ariaLabel: string;
      ageLabel: string;
      summary: string;
    };
    heartbeat: {
      title: string;
      ariaLabel: string;
      ageLabel: string;
      currentAgeLabel: string;
      conclusion: string;
    };
    strata: {
      title: string;
      ariaLabel: string;
      passed: string;
      notYet: string;
      conclusion: string;
    };
  };
  
  // Common
  common: {
    yearsOld: string;
    ageRange: string;
  };
}

export type TranslationKey = keyof Translations;
