import React from 'react';

import type { Theme } from '@amazon-devices/react-navigation__native';
import {
  NavigationContainer,
  NavigationIndependentTree,
} from '@amazon-devices/react-navigation__native';

import { useAppTheme } from '@AppTheme';
import { MainNavigator } from './MainNavigator';

export const MainStackNavigator = () => {
  const { isDarkTheme, colors } = useAppTheme();

  const navTheme: Theme = {
    dark: isDarkTheme,
    fonts: {
      regular: { fontFamily: 'System', fontWeight: '400' },
      medium: { fontFamily: 'System', fontWeight: '500' },
      bold: { fontFamily: 'System', fontWeight: '700' },
      heavy: { fontFamily: 'System', fontWeight: '900' },
    },
    colors: {
      primary: colors.primary,
      text: colors.onBackground,
      background: colors.background,
      border: colors.outline,
      card: colors.surface,
      notification: colors.onBackground,
    },
  };

  return (
    <NavigationIndependentTree>
      <NavigationContainer theme={navTheme}>
        <MainNavigator />
      </NavigationContainer>
    </NavigationIndependentTree>
  );
};
