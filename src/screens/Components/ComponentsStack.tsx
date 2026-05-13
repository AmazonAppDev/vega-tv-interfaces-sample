import React from 'react';

import { createStackNavigator } from '@amazon-devices/react-navigation__stack';

import { BrowseStack } from './BrowseStack';
import { Components } from './Components';
import { VerticalStack } from './VerticalStack';

const Stack = createStackNavigator();

export const ComponentsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ComponentsMain"
        component={Components}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="VerticalStack"
        component={VerticalStack}
        options={{
          animation: 'none',
          headerShown: true,
          title: 'Vertical Stack',
        }}
      />
      <Stack.Screen
        name="BrowseStack"
        component={BrowseStack}
        options={{
          animation: 'none',
          headerShown: true,
          title: 'Browse Stack',
        }}
      />
    </Stack.Navigator>
  );
};
