import React from 'react';

import { render } from '@testing-library/react-native';

import { Browse } from '../Browse';

jest.mock('@AppTheme', () => ({
  useThemedStyles: () => ({
    container: { flex: 1 },
    tabContainer: { flexDirection: 'row' },
    tab: { padding: 10 },
    tabText: { fontSize: 16 },
  }),
}));

describe('Browse Screen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Browse />);

    const tabs = ['Featured', 'Top charts', 'Categories', 'Purchased'];

    tabs.forEach(tab => {
      expect(getByText(tab)).toBeTruthy();
    });
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<Browse />);
    expect(toJSON()).toMatchSnapshot();
  });
});
