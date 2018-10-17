import config from '../config';
import i18n from '../i18n';

const { defaultLanguage, allLanguages, subpathsOnNonDefaultLanguageOnly } = config.translation;

export default (currentRoute, currentLanguage = i18n.languages[0]) => {
  if (!allLanguages.includes(currentLanguage)) {
    return currentRoute;
  }

  let correctRoute = currentRoute;

  for (const lng of allLanguages) {
    if (currentRoute.startsWith(`/${lng}/`)) {
      correctRoute = correctRoute.replace(`/${lng}/`, '/');
      break;
    }
  }

  if (!subpathsOnNonDefaultLanguageOnly || currentLanguage !== defaultLanguage) {
    correctRoute = `/${currentLanguage}${correctRoute}`;
  }

  return correctRoute;
};
