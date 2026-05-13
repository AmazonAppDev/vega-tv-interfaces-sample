import React, { createContext, useContext, useState } from 'react';
import { Dimensions } from 'react-native';

import { TVFocusGuideView } from '@amazon-devices/react-native-kepler';
import { createDrawerNavigator } from '@amazon-devices/react-navigation__drawer';
import type { NavigationContainerRef } from '@amazon-devices/react-navigation__native';
import {
  DrawerActions,
  NavigationContainer,
  NavigationIndependentTree,
} from '@amazon-devices/react-navigation__native';

const { width } = Dimensions.get('window');

const flexStyle = { flex: 1 } as const;

/**
 * Type definition for the drawer navigation parameters
 * @typedef {Object} DrawerParamList
 * @property {undefined} Drawer - The main drawer screen
 */
export type DrawerParamList = {
  Drawer: undefined;
};

type DrawerNavigationType = NavigationContainerRef<DrawerParamList>;

export const DrawerContext = createContext<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
  openDrawer: () => {},
  closeDrawer: () => {},
  toggleDrawer: () => {},
});

export const useDrawer = () => useContext(DrawerContext);

const Drawer = createDrawerNavigator();

/**
 * Props for the drawer content component
 * @typedef {Object} DrawerContentProps
 * @property {boolean} aria-modal - Indicates if the drawer should be treated as a modal
 * @property {boolean} aria-hidden - Controls visibility for screen readers
 * @property {'polite' | 'assertive' | 'off'} aria-live - Controls screen reader announcement behavior
 */
type DrawerContentProps = {
  'aria-modal': boolean;
  'aria-hidden': boolean;
  'aria-live': 'polite' | 'assertive' | 'off';
};

/**
 * Props for the DrawerWrapper component
 * @typedef {Object} DrawerWrapperProps
 * @property {React.ReactNode} children - The main content to be displayed
 * @property {React.ComponentType<DrawerContentProps>} drawerContent - Component to render inside the drawer
 * @property {number} [drawerWidth] - Width of the drawer (defaults to 60% of screen width)
 * @property {'left' | 'right'} [drawerPosition] - Position of the drawer (defaults to 'right')
 * @property {string} [overlayColor] - Color of the overlay behind the drawer
 * @property {'front' | 'back' | 'slide'} [drawerType] - Animation type for the drawer
 * @property {object} [screenOptions] - Additional options for the drawer navigator
 * @property {React.RefObject<DrawerNavigationType>} [navigationRef] - External navigation reference
 */
type DrawerWrapperProps = {
  children: React.ReactNode;
  drawerContent: React.ComponentType<DrawerContentProps>;
  drawerWidth?: number;
  drawerPosition?: 'left' | 'right';
  overlayColor?: string;
  drawerType?: 'front' | 'back' | 'slide';
  screenOptions?: object;
  navigationRef?: React.RefObject<DrawerNavigationType | null>;
};

/**
 * A wrapper component that provides drawer navigation functionality
 *
 * @component
 * @example
 * ```tsx
 * <DrawerWrapper
 *   drawerContent={CustomDrawerContent}
 *   drawerPosition="right"
 *   drawerWidth={300}
 * >
 *   <MainContent />
 * </DrawerWrapper>
 * ```
 * @param {DrawerWrapperProps} props - Component props
 * @returns {JSX.Element} A drawer navigation wrapper component
 */
export const DrawerWrapper = ({
  children,
  drawerContent: DrawerContent,
  drawerWidth = width * 0.6,
  drawerPosition = 'right',
  overlayColor = 'rgba(0,0,0,0.5)',
  drawerType = 'front',
  screenOptions = {},
  navigationRef,
}: DrawerWrapperProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const internalRef = React.useRef<DrawerNavigationType>(null);
  const drawerRef = navigationRef || internalRef;

  const openDrawer = () => {
    setIsOpen(true);
    drawerRef.current?.dispatch(DrawerActions.openDrawer());
  };

  const closeDrawer = () => {
    setIsOpen(false);
  };

  const toggleDrawer = () => {
    setIsOpen(prev => !prev);
    drawerRef.current?.dispatch(DrawerActions.toggleDrawer());
  };

  return (
    <DrawerContext.Provider
      value={{ isOpen, openDrawer, closeDrawer, toggleDrawer, setIsOpen }}
    >
      <NavigationIndependentTree>
        <NavigationContainer ref={drawerRef}>
          <Drawer.Navigator
            screenOptions={{
              drawerStyle: {
                width: drawerWidth,
                display: isOpen ? 'flex' : 'none',
              },
              headerShown: false,
              overlayColor: isOpen ? overlayColor : 'transparent',
              drawerType,
              drawerPosition,
              swipeEnabled: false,
              ...screenOptions,
            }}
            drawerContent={() =>
              isOpen ? (
                <DrawerContent
                  aria-modal={true}
                  aria-hidden={!isOpen}
                  aria-live={isOpen ? 'polite' : 'off'}
                />
              ) : null
            }
          >
            <Drawer.Screen
              name="Drawer"
              options={{
                title: 'Drawer',
                swipeEnabled: false,
              }}
            >
              {() => (
                <TVFocusGuideView trapFocusDown trapFocusUp style={flexStyle}>
                  {children}
                </TVFocusGuideView>
              )}
            </Drawer.Screen>
          </Drawer.Navigator>
        </NavigationContainer>
      </NavigationIndependentTree>
    </DrawerContext.Provider>
  );
};
