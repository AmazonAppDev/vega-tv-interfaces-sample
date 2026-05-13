import React from 'react';
import { Text } from 'react-native';

import { render, screen } from '@testing-library/react-native';

import { Carousel } from '../Carousel';

describe('Carousel', () => {
  const mockData = ['item1', 'item2', 'item3'];

  const mockDataAdapter = {
    getItem: (index: number) =>
      index >= 0 && index < mockData.length ? mockData[index] : undefined,
    getItemCount: () => mockData.length,
    getItemKey: (info: { item: string; index: number }) => `item-${info.index}`,
    notifyDataError: () => false,
  };

  const mockProps = {
    dataAdapter: mockDataAdapter,
    renderItem: (info: { item: string }) => <Text>{info.item}</Text>,
  };

  it('applies custom styles correctly', () => {
    const customStyles = {
      backgroundColor: 'red',
      padding: 20,
    };

    render(<Carousel {...mockProps} customStyles={customStyles} />);

    const carouselWrapper = screen.getByTestId('carousel-wrapper');

    expect(carouselWrapper.props['style']).toContainEqual(customStyles);
  });
});
