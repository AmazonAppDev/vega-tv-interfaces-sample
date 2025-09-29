/*
 * Copyright (c) 2025 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

import * as React from 'react';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';

import { GestureHandlerRootView } from '@amazon-devices/react-native-gesture-handler';
import {
  useHideSplashScreenCallback,
  usePreventHideSplashScreen,
} from '@amazon-devices/react-native-kepler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AppThemeProvider, darkTheme } from '@AppTheme';
import { TranslationProvider } from '@AppServices/i18n';
import { MainStackNavigator } from '@AppSrc/navigators';
import { CustomDrawer } from './components/navigation/CustomDrawer';
import { TVFocusProvider } from './hooks';

const SPLASH_SCREEN_ADDITIONAL_DURATION_MS = 4000;

const queryClient = new QueryClient();

export const App = () => {
  const hideSplashScreen = useHideSplashScreenCallback();
  usePreventHideSplashScreen();
  if (__DEV__) {
    hideSplashScreen();
  }

  useEffect(() => {
    // Handle splash screen independently
    let timeout: NodeJS.Timeout | null = null;
    timeout = setTimeout(() => {
      timeout = null;
      hideSplashScreen();
    }, SPLASH_SCREEN_ADDITIONAL_DURATION_MS);

    return () => {
      if (timeout !== null) {
        clearTimeout(timeout);
      }
    };
  }, [hideSplashScreen]);

  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider theme={darkTheme}>
        <TranslationProvider>
          <GestureHandlerRootView style={styles.container}>
            <TVFocusProvider>
              <CustomDrawer>
                <MainStackNavigator />
              </CustomDrawer>
            </TVFocusProvider>
          </GestureHandlerRootView>
        </TranslationProvider>
      </AppThemeProvider>
    </QueryClientProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
