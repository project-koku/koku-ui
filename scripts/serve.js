const express = require('express');
const path = require('path');
const app = express();
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-express-middleware');
const fs = require('fs');
const url = require('url');
const compression = require('compression');

const publicDir = path.resolve(__dirname, '../public');
const languages = fs.readdirSync(publicDir);

i18next.use(i18nextMiddleware.LanguageDetector).init({
  languages,
  whitelist: languages
});

app.use(
  compression(),
  i18nextMiddleware.handle(i18next),
  (req, res, next) => {
    req.url = `/${req.language}${req.url}`;
    next();
  },
  express.static(publicDir)
);

// ALlow the Client Router to handle 404 pages.
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, req.language, 'index.html'));
});

app.listen(3000, () => {
  console.log('🌎 Example app listening on port 3000'); // tslint:disable-line no-console
});
