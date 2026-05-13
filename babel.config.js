/*
 * Copyright (c) 2025 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

const appConfigPlugin = require('./src/services/appConfig/babel/appConfigPlugin.js');

const isDebug =
  process.env['REACT_APP_DEBUG'] === '1' ||
  process.env['REACT_APP_DEBUG'] === 'true';

module.exports = (api) => {
  const babelEnv = api.env();

  // plugins common fo all environment
  const plugins = [
    [
      'module-resolver',
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        root: ['./'],
        alias: {
          '@Api': './src/api',
          '@AppAssets': './src/assets',
          '@AppComponents': './src/components',
          '@AppScreens': './src/screens',
          '@AppServices': './src/services',
          '@AppUtils': './src/utils',
          '@AppTestUtils': './src/test-utils',
          '@AppTheme': './src/theme',
          '@AppStore': './src/store',
          '@AppModels': './src/models',
          '@AppSrc': './src',
          '@AppRoot': './',
        },
      },
    ],
    '@amazon-devices/react-native-reanimated/plugin',
    appConfigPlugin(api),
  ];

  // plugins pushed only for "test" env
  if (babelEnv === 'test') {
    if (!isDebug) {
      // NOTE: strip console.logs from testing enviroment if not in DEBUG mode
      // intentionally preserving console.errors and console.warnings
      plugins.push([
        'transform-remove-console',
        { exclude: ['error', 'warn'] },
      ]);
    }
  }

  // plugins pushed only for "production" env
  if (babelEnv === 'production') {
    plugins.push('transform-remove-console');
  }

  const presets = ['module:@react-native/babel-preset'];

  return {
    presets,
    plugins,
  };
};
