const parseURL = require('url').parse;
const { allLanguages } = require('../config.js').translation;

module.exports = (req, res, cb) => {
  const { pathname, search } = parseURL(req.url);
  allLanguages.forEach(lng => {
    if (pathname === `/${lng}`) {
      res.redirect(301, pathname.replace(`/${lng}`, `/${lng}/`) + (search || ''));
    }
  });
  cb();
};
