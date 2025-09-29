import React from 'react';

import type { Theme } from '@amazon-devices/react-navigation__native';
import { NavigationContainer } from '@amazon-devices/react-navigation__native';

import { useAppTheme } from '@AppTheme';
import { MainNavigator } from './MainNavigator';

export const MainStackNavigator = () => {
  const { isDarkTheme, colors } = useAppTheme();

  const navTheme: Theme = {
    dark: isDarkTheme,
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
    <NavigationContainer theme={navTheme} independent={true}>
      <MainNavigator />
    </NavigationContainer>
  );
};
