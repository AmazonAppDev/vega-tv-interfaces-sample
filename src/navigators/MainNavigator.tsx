import React from 'react';

import { createStackNavigator } from '@amazon-devices/react-navigation__stack';

import { MainMenuNavigator } from './MainMenuNavigator';
import type { MainNavigatorParamList } from './types';

const Stack = createStackNavigator<MainNavigatorParamList>();

export const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Drawer" component={MainMenuNavigator} />
    </Stack.Navigator>
  );
};
