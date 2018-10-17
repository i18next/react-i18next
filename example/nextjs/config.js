module.exports = {
  translation: {
    // default / fallback language
    defaultLanguage: 'en',

    // needed for serverside preload
    allLanguages: ['en', 'de'],
    allNamespaces: ['common', 'home', 'page2'],

    // optional settings needed for subpath (/de/page1) handling
    enableSubpaths: false,
    subpathsOnNonDefaultLanguageOnly: false, // only redirect to /lng/ if not default language
  },
};
