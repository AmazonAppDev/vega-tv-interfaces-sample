import React from 'react';

import { render } from '@testing-library/react-native';

import { App } from '@AppSrc/App';

describe('App', () => {
  it('renders home screen', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('home')).toBeTruthy();
  });
});
