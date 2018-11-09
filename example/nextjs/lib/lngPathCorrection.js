import config from '../config';
import i18n from '../i18n';

const { defaultLanguage, allLanguages } = config.translation;

export default (currentRoute, currentLanguage = i18n.languages[0]) => {
  if (!allLanguages.includes(currentLanguage)) {
    return currentRoute;
  }

  let href = currentRoute;
  let as = href;

  for (const lng of allLanguages) {
    if (href.startsWith(`/${lng}/`)) {
      href = href.replace(`/${lng}/`, '/');
      break;
    }
  }

  if (currentLanguage !== defaultLanguage) {
    as = `/${currentLanguage}${href}`;
    href += `?lng=${currentLanguage}`;
  } else {
    as = href;
  }

  return [href, as];
};
