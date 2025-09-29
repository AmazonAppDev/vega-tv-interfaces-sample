import React from 'react';
import { View } from 'react-native';

import { FlashList } from '@amazon-devices/shopify__flash-list';
import { screen } from '@testing-library/react-native';

import { Avatar, ImageTile } from '@AppComponents/core';
import type { Item } from '@AppScreens/Components/VerticalStack';
import { renderWithTheme } from '@AppTestUtils/render';
import { VerticalCarousel } from '../VerticalCarousel';

// Mock the required dependencies
jest.mock('@amazon-devices/shopify__flash-list', () => ({
  FlashList: jest.fn(({ data, renderItem, keyExtractor }) => (
    <>
      {data.map((item: Item, index: number) =>
        renderItem({
          item,
          index,
          key: keyExtractor ? keyExtractor(item, index) : index,
        }),
      )}
    </>
  )),
}));

describe('VerticalCarousel', () => {
  const mockData: Item[] = [
    {
      id: '1',
      title: 'Title 1',
      date: '2023-10-01',
      duration: '5 min',
      shortDescription: 'Short description 1',
    },
    {
      id: '2',
      title: 'Title 2',
      date: '2023-10-02',
      duration: '10 min',
      shortDescription: 'Short description 2',
    },
  ];

  it('renders correctly', () => {
    const { toJSON } = renderWithTheme(<VerticalCarousel data={mockData} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders the correct number of items', () => {
    renderWithTheme(<VerticalCarousel data={mockData} />);

    // Check if all items are rendered
    mockData.forEach(item => {
      expect(screen.getByTestId(`box-${item.id}`)).toBeOnTheScreen();
      expect(screen.getByText(item.title)).toBeOnTheScreen();
      expect(screen.getByText(item.date)).toBeOnTheScreen();
      expect(screen.getByText(item.duration)).toBeOnTheScreen();
      expect(screen.getByText(item.shortDescription)).toBeOnTheScreen();
    });
  });

  it('renders all required components with correct props', () => {
    const { UNSAFE_root } = renderWithTheme(
      <VerticalCarousel data={mockData} />,
    );

    // Check Avatar
    const avatars = UNSAFE_root.findAllByType(Avatar);
    avatars.forEach(avatar => {
      expect(avatar.props).toMatchObject({
        testID: 'avatar-image-wrapper',
        image: 'http://fake/image',
        placeholder: 'john',
      });
    });

    // Check ImageTile
    const imageTile = UNSAFE_root.findByType(ImageTile);
    expect(imageTile.props).toMatchObject({
      width: 340,
      height: 540,
    });
  });

  it('renders the header text correctly', () => {
    renderWithTheme(<VerticalCarousel data={mockData} />);
    expect(screen.getByText('Shopify FlashList')).toBeOnTheScreen();
  });

  it('renders with empty data', () => {
    renderWithTheme(<VerticalCarousel data={[]} />);
    expect(screen.getByText('Shopify FlashList')).toBeOnTheScreen();
  });

  it('configures FlashList correctly', () => {
    const { UNSAFE_root } = renderWithTheme(
      <VerticalCarousel data={mockData} />,
    );
    const flashList = UNSAFE_root.findByType(FlashList);

    expect(flashList.props).toMatchObject({
      data: mockData,
      estimatedItemSize: 185,
      horizontal: false,
      bounces: false,
    });
  });

  it('generates correct key for each item', () => {
    const { UNSAFE_root } = renderWithTheme(
      <VerticalCarousel data={mockData} />,
    );
    const flashList = UNSAFE_root.findByType(FlashList);
    const keyExtractor = flashList.props['keyExtractor'];

    mockData.forEach((item, index) => {
      expect(keyExtractor(item, index)).toBe(
        `vertical-carousel-${item.id}-${index}`,
      );
    });
  });

  it('applies correct styles', () => {
    const { UNSAFE_root } = renderWithTheme(
      <VerticalCarousel data={mockData} />,
    );
    const container = UNSAFE_root.findByType(View);
    expect(container.props['style']).toBeDefined();
  });
});
