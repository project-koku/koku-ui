const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../public');
const localeBundles = fs.readdirSync(distDir);

const redirectForLanguageCode = code =>
  `/* /${code}/:splat 200 Language=${code}`;

const content = [
  ...localeBundles.map(redirectForLanguageCode),
  '/* /en/:splat 200',
].join('\n');

fs.writeFileSync(path.join(distDir, '_redirects'), content);
