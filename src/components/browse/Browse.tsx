import React, { useState } from 'react';
import { Text, View } from 'react-native';

import { useThemedStyles } from '@AppTheme';
import { BottomModal } from '@AppComponents/BottomModal';
import { Box } from '@AppComponents/core/Box/Box';
import { useDrawer } from '@AppComponents/navigation/CustomDrawer';
import {
  FocusGuideView,
  useFocusGuideEventHandler,
} from '@AppServices/focusGuide';
import { useFocusCollection } from '@AppSrc/hooks';
import { getBrowseStyle } from './styles';

const tabs = ['Open Drawer', 'Open Modal', 'Categories', 'Purchased'];

export const Browse = () => {
  const { openDrawer, isOpen, closeDrawer } = useDrawer();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const styles = useThemedStyles(getBrowseStyle);
  const [activeTabIndex, setActiveTabIndex] = React.useState(-1);

  const { registerRef, focusItem } = useFocusCollection();

  useFocusGuideEventHandler(event => {
    if (isOpen && event.eventType === 'back') {
      closeDrawer();
      focusItem(tabs[0]!); // focus the first tab
    }
  });

  return (
    <FocusGuideView style={styles.container} autoFocus trapFocusRight>
      <View style={[styles.tabContainer]}>
        {tabs.map((tab, index) => (
          <Box
            testID={`tab-${tab}`}
            key={tab}
            ref={element => {
              registerRef(tab, element);
              if (index === 0 && !isOpen) {
                registerRef(tab, element);
              }
            }}
            hasTVPreferredFocus={!isOpen && index === 0}
            focusable={true}
            style={[styles.tab, activeTabIndex === index && styles.activeTab]}
            onPress={() => {
              setActiveTabIndex(index);
              focusItem(tab);

              if (index === 0) {
                openDrawer();
              } else if (index === 1) {
                setIsModalVisible(true);
              }
            }}
          >
            <Text style={styles.tabText}>{tab}</Text>
          </Box>
        ))}
      </View>
      <BottomModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </FocusGuideView>
  );
};
