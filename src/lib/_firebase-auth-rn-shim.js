/**
 * Shim for the Firebase Auth React Native persistence helper.
 *
 * Using a direct relative path (instead of the module specifier
 * '@firebase/auth/dist/rn/index.js') bypasses Node 24's strict
 * package.json `exports` field enforcement, so Metro never shows
 * the "not listed in exports" WARN and does not attempt an expensive
 * file-based fallback that can cause ENOMEM in jest-worker.
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
module.exports = require('../node_modules/@firebase/auth/dist/rn/index.js');
