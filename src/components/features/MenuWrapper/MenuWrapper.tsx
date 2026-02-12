import React, { useMemo, useState } from 'react';
import { View } from 'react-native';

import type { NavigationProp } from '@amazon-devices/react-navigation__core';
import { useNavigation } from '@amazon-devices/react-navigation__core';
import { useDrawerStatus } from '@amazon-devices/react-navigation__drawer';
import { DrawerActions } from '@amazon-devices/react-navigation__routers';

import { useThemedStyles } from '@AppTheme';
import { injectListNavigationHints } from '@AppServices/a11y';
import {
  FocusGuideView,
  useFocusGuideEventHandler,
} from '@AppServices/focusGuide';
import { useTranslation } from '@AppServices/i18n';
import type { MainMenuParamList } from '@AppSrc/navigators/MainMenuNavigator/MainMenuNavigator';
import type { MenuItemProps } from './MenuItem';
import { MenuItem } from './MenuItem';
import { MENU_WIDTHS } from './constants';
import { getMenuWRapperStyles } from './styles';

export const MenuWrapper: React.FC = () => {
  const [activeMenuItemIndex, setActiveMenuItemIndex] = useState(0);
  const isOpen = useDrawerStatus() === 'open';
  const navigation = useNavigation<NavigationProp<MainMenuParamList>>();
  const styles = useThemedStyles(getMenuWRapperStyles);
  const { t } = useTranslation();

  const wrapperWidth = isOpen ? MENU_WIDTHS.open : MENU_WIDTHS.closed;

  const menuItems: MenuItemProps[] = useMemo(
    () => [
      {
        label: t('menu-wrapper-item-home-label'),
        onPress: () => navigation.navigate('Home'),
        icon: 'home',
      },
      {
        label: t('menu-wrapper-item-components-label'),
        onPress: () => navigation.navigate('Components'),
        icon: 'apps',
      },
    ],
    [navigation, t],
  );

  const menuItemsToRender = useMemo(
    () =>
      injectListNavigationHints(menuItems, {
        directionLabels: {
          previous: t('a11y-hint-direction-up'),
          next: t('a11y-hint-direction-down'),
        },
        formatOtherItemNavigationHint: ({ item: { label }, direction }) =>
          t('menu-item-use-direction-to-go-to-a11y-label')
            .replace('<direction>', direction)
            .replace('<go-to-label>', label),
        firstItemAdditionalHint: t(
          'menu-item-use-direction-to-go-to-a11y-label',
        )
          .replace('<direction>', t('a11y-hint-direction-up'))
          .replace(
            '<go-to-label>',
            t('menu-wrapper-a11y-label-profile-avatar'),
          ),
        lastItemAdditionalHint: t('menu-item-use-direction-to-go-to-a11y-label')
          .replace('<direction>', t('a11y-hint-direction-down'))
          .replace('<go-to-label>', t('close-menu-button-a11y-label')),
      }),
    [menuItems, t],
  );

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };
  const closeDrawer = () => {
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  const onMenuItemFocus = () => {
    if (!isOpen) {
      openDrawer();
    }
  };

  useFocusGuideEventHandler(event => {
    if (isOpen && event.eventType === 'right') {
      closeDrawer();
    }
  });

  const menuA11yLabelSentencePrefix = t(
    'menu-wrapper-a11y-label-menu-sentence-prefix',
  );

  return (
    <FocusGuideView
      style={[styles.wrapper, { width: wrapperWidth }]}
      trapFocusDown
      trapFocusUp
      autoFocus
    >
      <View>
        {menuItemsToRender.map(
          ({ item: { label, onPress, icon }, hints }, index) => (
            <MenuItem
              key={label}
              label={label}
              aria-label={`${menuA11yLabelSentencePrefix} ${label}`}
              accessibilityHint={hints.join(' ')}
              onPress={() => {
                onPress();
                setActiveMenuItemIndex(index);
              }}
              icon={icon}
              isExpanded={isOpen}
              onFocus={onMenuItemFocus}
              isActive={activeMenuItemIndex === index}
              hasTVPreferredFocus={isOpen && activeMenuItemIndex === index}
            />
          ),
        )}
      </View>
    </FocusGuideView>
  );
};
