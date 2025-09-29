import React from 'react';

import { screen } from '@testing-library/react-native';

import { TVFocusProvider } from '@AppSrc/hooks';
import { renderWithProviders } from '@AppTestUtils/render';
import { Home } from '../Home';

jest.useFakeTimers();

describe('Home', () => {
  describe('should render Home screen correctly', () => {
    const renderScreen = () =>
      renderWithProviders(
        <TVFocusProvider>
          <Home />
        </TVFocusProvider>,
        {
          routeName: 'Home',
        },
      );

    it('should render screen container with home testId', async () => {
      renderScreen();

      const element = await screen.findByTestId('home');

      expect(element).toBeOnTheScreen();
    });
  });
});
