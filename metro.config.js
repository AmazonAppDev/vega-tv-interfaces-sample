/*
 * Copyright (c) 2025 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const crypto = require('crypto');
const fs = require('fs');

function hashFileContent(filePath, hashName = 'sha256') {
  if (!fs.existsSync(filePath)) {
    return;
  } else {
    const hash = crypto.createHash(hashName);
    hash.update(fs.readFileSync(filePath));
    return hash.digest('hex');
  }
}

const cacheVersion = hashFileContent('.env');

/**
+ * Metro configuration
+ * https://facebook.github.io/metro/docs/configuration
  *
+ * @type {import('metro-config').MetroConfig}
  */
const config = { cacheVersion };

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
