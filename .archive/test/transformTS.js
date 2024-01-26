const tsc = require('typescript');
const tsConfig = require('../tsconfig.json');

const options = {
  ...tsConfig.compilerOptions,
  module: tsc.ModuleKind.CommonJS,
  inlineSourceMap: true,
  inlineSources: true,
};

delete options.outDir;
delete options.sourceMap;

module.exports = {
  process(src, path) {
    if (
      path.endsWith('.ts') ||
      path.endsWith('.tsx') ||
      path.includes('@patternfly/react-icons/dist/esm') ||
      path.includes('uuid/dist/esm-browser')
    ) {
      return { code: tsc.transpile(src, options, path, []) };
    }
    return { code: src };
  },
};
