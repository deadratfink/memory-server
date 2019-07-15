#!/usr/bin/env node

/* eslint-disable import/no-commonjs */
const { writeFileSync } = require('fs');
const { name, version, description } = require('../package.json');
/* eslint-enable import/no-commonjs */

/**
 * @module helper:readme-prefix
 * @description A helper to Prefix the resulting _README.md_ content from _DOCUMENTATION.md_ with the projects name,
 * version and description.
 */

/**
 * The main headline of document.
 * @type {string}
 * @private
 */
const mainHeadline = `# ${name} (v${version})`;

writeFileSync('./README.md', `${mainHeadline}\n\n${description}\n\n`);
