#!/usr/bin/env node
/**
 * Backfill missing `resolved` URLs in package-lock.json for Hermeto/Konflux
 * hermetic npm prefetch. npm lockfile v3 often omits resolved; Hermeto skips
 * those packages and hermetic npm ci then hits the registry.
 *
 * Usage: node scripts/backfill-lockfile-resolved.mjs [path/to/package-lock.json]
 *
 * Registry base URL defaults to https://registry.npmjs.org and can be overridden
 * with npm_config_registry (same as npm).
 */
import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_REGISTRY = 'https://registry.npmjs.org';
const lockPath = path.resolve(process.argv[2] ?? 'package-lock.json');

function getRegistryBase() {
  return (process.env.npm_config_registry || DEFAULT_REGISTRY).replace(/\/$/, '');
}

function packageNameFromPath(packagePath) {
  const parts = packagePath.split('/');
  const nm = parts.lastIndexOf('node_modules');
  if (nm === -1) {
    return null;
  }
  const rest = parts.slice(nm + 1);
  if (!rest.length) {
    return null;
  }
  if (rest[0].startsWith('@')) {
    if (rest.length < 2) {
      return null;
    }
    return `${rest[0]}/${rest[1]}`;
  }
  return rest[0];
}

function isValidNpmPackageName(name) {
  if (!name || typeof name !== 'string') {
    return false;
  }
  if (name.startsWith('@')) {
    const slash = name.indexOf('/');
    return slash > 1 && slash < name.length - 1;
  }
  return !name.startsWith('@');
}

function registryResolved(registryBase, name, version) {
  if (!isValidNpmPackageName(name)) {
    return null;
  }
  if (name.startsWith('@')) {
    const pkg = name.slice(name.indexOf('/') + 1);
    return `${registryBase}/${name}/-/${pkg}-${version}.tgz`;
  }
  return `${registryBase}/${name}/-/${name}-${version}.tgz`;
}

function loadLockfile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`Lockfile not found: ${filePath}`);
    } else if (error instanceof SyntaxError) {
      console.error(`Invalid JSON in lockfile: ${filePath}`);
    } else {
      console.error(`Failed to read lockfile ${filePath}: ${error.message}`);
    }
    process.exit(1);
  }
}

function writeLockfile(filePath, lock) {
  try {
    fs.writeFileSync(filePath, `${JSON.stringify(lock, null, 2)}\n`);
  } catch (error) {
    console.error(`Failed to write lockfile ${filePath}: ${error.message}`);
    process.exit(1);
  }
}

const lock = loadLockfile(lockPath);
const registryBase = getRegistryBase();
let updated = 0;
let skipped = 0;

for (const [pkgPath, pkg] of Object.entries(lock.packages ?? {})) {
  if (!pkgPath || pkg.link || pkg.resolved || pkg.inBundle || !pkg.version) {
    continue;
  }
  if (!pkgPath.includes('node_modules/')) {
    continue;
  }

  const pathName = packageNameFromPath(pkgPath);
  const name = pkg.name || pathName;
  const resolved = registryResolved(registryBase, name, pkg.version);
  if (!resolved) {
    skipped++;
    console.warn(`Skipped ${pkgPath}: unable to derive npm registry URL for "${name ?? ''}"`);
    continue;
  }

  pkg.resolved = resolved;
  updated++;
}

writeLockfile(lockPath, lock);
console.log(`Updated ${updated} packages in ${lockPath}`);
if (skipped > 0) {
  console.warn(`Skipped ${skipped} packages with unknown or invalid npm package names`);
  process.exit(1);
}
