const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Keep file-based resolution for packages that don't expose all subpaths
config.resolver.unstable_enablePackageExports = false;


// Block server-only packages from entering the Metro bundle.
// firebase-admin is only used in Node scripts and must never be bundled.
const { blockList: existingBlockList } = config.resolver;
const adminPattern = /node_modules[\\/]firebase-admin[\\/]/;
if (existingBlockList instanceof RegExp) {
  config.resolver.blockList = new RegExp(
    `${existingBlockList.source}|${adminPattern.source}`
  );
} else {
  config.resolver.blockList = adminPattern;
}

// Force Metro to run tasks on the main process to bypass Node.js v24 child process serialization memory errors
config.maxWorkers = 1;

module.exports = withNativeWind(config, { input: './global.css' });