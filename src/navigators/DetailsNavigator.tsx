import React from 'react';

import { createStackNavigator } from '@amazon-devices/react-navigation__stack';

import { Details } from '@AppScreens/Details';

const Stack = createStackNavigator();

export const DetailsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DetailsMain" component={Details} />
    </Stack.Navigator>
  );
};
