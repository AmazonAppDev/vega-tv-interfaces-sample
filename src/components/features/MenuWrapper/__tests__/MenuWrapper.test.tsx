import React from 'react';
import { Text } from 'react-native';

import { createDrawerNavigator } from '@amazon-devices/react-navigation__drawer';
import { NavigationContainer } from '@amazon-devices/react-navigation__native';
import { screen } from '@testing-library/react-native';

import { renderWithTheme } from '@AppTestUtils/render';
import { MenuWrapper } from '../MenuWrapper';

jest.useFakeTimers();

const HomeMock = () => <Text>Home</Text>;

const Drawer = createDrawerNavigator();

const mockNavigation = {
  navigate: jest.fn(),
  closeDrawer: jest.fn(),
  openDrawer: jest.fn(),
};
const renderDrawerContent = () => <MenuWrapper navigation={mockNavigation} />;

const DrawerWrapper = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          drawerType: 'permanent',
        }}
        drawerContent={renderDrawerContent}
      >
        <Drawer.Screen name="Home" component={HomeMock} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

describe('<MenuWrapper />', () => {
  it('should render properly in default state', async () => {
    renderWithTheme(<DrawerWrapper />);

    const headerText = await screen.findByText('Home');

    expect(headerText).toBeOnTheScreen();
  });
});
