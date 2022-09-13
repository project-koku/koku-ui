const fs = require('fs');
const lockfile = require('@yarnpkg/lockfile');

function getNameFromVersionString(nameAndVersion) {
  var sep = nameAndVersion.split('@');
  var name = sep.slice(0, sep.length - 1).join('@');
  return name;
}

function parseDependencies(manifest) {
  var dependencies = lockfile.parse(manifest).object;
  var depArray = [];
  Object.keys(dependencies).forEach(dep => {
    depArray.push({
      name: getNameFromVersionString(dep),
      version: dependencies[dep].version,
      type: 'runtime',
    });
  });
  return depArray;
}

function stringifyDependencies(dependencies) {
  let depString = '';
  let prefix = 'mgmt_services/cost-mgmt:koku-ui/';
  for (let dep of dependencies) {
    depString += prefix + dep.name + ':' + dep.version + '.yarnlock\n';
  }
  return depString;
}

let file = fs.readFileSync('yarn.lock', 'utf8');
let deps = parseDependencies(file);
let path = 'koku-ui-manifest';
let data = stringifyDependencies(deps);
let buffer = new Buffer.from(data);

fs.open(path, 'w', function(err, fd) {
  if (err) {
    throw new Error('Could not open file: ' + err);
  }
  fs.write(fd, buffer, 0, buffer.length, null, function(writeErr) {
    if (err) {
      throw new Error('Error writing file: ' + writeErr);
    }
    fs.close(fd, function(closeErr) {
      if (closeErr) {
        throw new Error('Could not close file: ' + closeErr);
      }
    });
  });
});
