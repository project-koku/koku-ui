const express = require('express');
const path = require('path');
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-express-middleware');
const fs = require('fs');
const compression = require('compression');
const urljoin = require('url-join');
const helmet = require('helmet');
const morgan = require('morgan');

const port = process.env.NODE_PORT || 8080;
const isProduction = process.env.NODE_ENV === 'production';

const app = express();

const baseDir = path.resolve(__dirname, '../');
const publicDir = path.join(baseDir, './public');
const languages = fs.readdirSync(publicDir);

i18next.use(i18nextMiddleware.LanguageDetector).init({
  whitelist: languages,
});

app.use(
  helmet(),
  compression(),
  i18nextMiddleware.handle(i18next),
  (req, res, next) => {
    req.url = urljoin('/', req.language, req.url);
    next();
  },
  morgan(isProduction ? 'combined' : 'dev'),
  express.static(publicDir)
);

// ALlow the Client Router to handle 404 pages.
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, req.language, 'index.html'));
});

app.listen(port, () => {
  console.log(`🌎  Koku-UI is now running on port ${port}`); // tslint:disable-line no-console
});
