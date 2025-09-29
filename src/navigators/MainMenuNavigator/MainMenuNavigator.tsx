import React from 'react';
import { StyleSheet } from 'react-native';

import type { Route } from '@amazon-devices/react-navigation__core';
import { getFocusedRouteNameFromRoute } from '@amazon-devices/react-navigation__core';
import { createDrawerNavigator } from '@amazon-devices/react-navigation__drawer';

import { MenuWrapper, MENU_WIDTHS } from '@AppComponents/features';
import { ComponentsStack } from '@AppScreens/Components/ComponentsStack';
import { Home } from '@AppScreens/Home';
import { DetailsStack } from '@AppSrc/navigators/DetailsNavigator';

const Drawer = createDrawerNavigator();

const renderDrawerContent = () => <MenuWrapper />;

const getNestedScreen = (route: Partial<Route<string>>) => {
  const routeName = getFocusedRouteNameFromRoute(route);
  return routeName === 'DetailsVideoPlayerScreen' ? 'back' : 'permanent';
};

export type MainMenuParamList = {
  Home: undefined;
  Components: undefined;
  Details: {
    screen: 'DetailsMain';
    params: null;
  };
};

export const MainMenuNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerType: 'permanent',
        drawerStyle: styles.drawer,
        overlayColor: 'transparent',
      }}
      drawerContent={renderDrawerContent}
    >
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Components" component={ComponentsStack} />
      <Drawer.Screen
        name="Details"
        component={DetailsStack}
        options={({ route }) => ({
          drawerType: getNestedScreen(route),
        })}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawer: {
    width: MENU_WIDTHS.closed,
  },
});
