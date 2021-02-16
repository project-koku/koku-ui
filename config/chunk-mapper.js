class ChunkMapper {
  // Looks like this file may not be needed anymore or there is an upstream bug
  // https://github.com/RedHatInsights/frontend-components/blob/master/packages/config/chunk-mapper.js
  // Just emit an empty JSON file for now
  apply(compiler) {
    compiler.hooks.emit.tap('ChunkMapper', compilation => {
      compilation.assets['fed-mods.json'] = {
        source: () => '{}',
        length: () => 2
      }
    });
  }
}

module.exports = ChunkMapper;

