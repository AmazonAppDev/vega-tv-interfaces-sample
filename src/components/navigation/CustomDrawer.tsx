import React from 'react';
import { Dimensions } from 'react-native';

import type { NavigationContainerRef } from '@amazon-devices/react-navigation__native';

import type { DrawerParamList } from '../common/DrawerWrapper';
import { DrawerWrapper } from '../common/DrawerWrapper';
import { FiltersScreen } from '../filters/FiltersScreen';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.6;

export { useDrawer } from '../common/DrawerWrapper';

export const drawerRef =
  React.createRef<NavigationContainerRef<DrawerParamList>>();

export const CustomDrawer = ({ children }: { children: React.ReactNode }) => {
  return (
    <DrawerWrapper
      drawerContent={FiltersScreen}
      drawerWidth={DRAWER_WIDTH}
      navigationRef={drawerRef}
    >
      {children}
    </DrawerWrapper>
  );
};
