module.exports = {
  translation: {
    // default / fallback language
    defaultLanguage: 'en',
    localesPath: './static/locales/',

    // needed for serverside preload
    allLanguages: ['en', 'de'],

    // optional settings needed for subpath (/de/page1) handling
    enableSubpaths: false,
    subpathsOnNonDefaultLanguageOnly: false, // only redirect to /lng/ if not default language
  },
};
