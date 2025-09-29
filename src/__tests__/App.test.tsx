import React from 'react';

import { render } from '@testing-library/react-native';

import { App } from '@AppSrc/App';

describe('App', () => {
  it('renders home screen', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('home')).toBeTruthy();
  });

  it('renders menu items', () => {
    const { getByTestId } = render(<App />);
    expect(
      getByTestId('menu-menu-wrapper-item-home-label-button-opacity'),
    ).toBeTruthy();
  });
});
