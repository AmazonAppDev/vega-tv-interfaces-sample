import React, { useEffect } from 'react';
import { Text, View, TouchableOpacity, findNodeHandle } from 'react-native';

import { useThemedStyles } from '@AppTheme';
import { useFocusCollection, useFocusManager } from '@AppSrc/hooks';
import { logDebug } from '@AppUtils/logging';
import { getBrowseStyle } from '../browse/styles';
import { useDrawer } from '../navigation/CustomDrawer';

const filters = [
  {
    id: 'length',
    title: '⏳ Length',
    subFilters: [
      { id: 'short', label: '0-15 min' },
      { id: 'medium', label: '15-30 min' },
      { id: 'long', label: '30+ min' },
    ],
  },
  { id: 'instructor', title: '👤 Instructor' },
  { id: 'classType', title: '🏋️ Class Type' },
  {
    id: 'language',
    title: '🌍 Class Language',
    subFilters: [
      { id: 'english', label: 'English' },
      { id: 'spanish', label: 'Spanish' },
      { id: 'french', label: 'French' },
      { id: 'german', label: 'German' },
    ],
  },
  { id: 'difficulty', title: '📊 Difficulty' },
];

export const FiltersScreen: React.FC = () => {
  const styles = useThemedStyles(getBrowseStyle);
  const { closeDrawer, isOpen } = useDrawer();

  const { registerRef, focusItem, blurItem, getCurrentFocused } =
    useFocusCollection();

  const closeButtonFocus = useFocusManager({
    trapFocus: true,
  });

  const [expandedFilter, setExpandedFilter] = React.useState<string | null>(
    null,
  );

  const handleFilterPress = (filterId: string) => {
    setExpandedFilter(prev => (prev === filterId ? null : filterId));
  };

  useEffect(() => {
    if (isOpen) {
      focusItem(filters[0]?.id ?? '');
      setExpandedFilter(null);
    }
  }, [focusItem, isOpen]);

  return (
    <View style={styles.drawerContainer}>
      <Text style={styles.header}>Filters</Text>

      {filters.map((filter, index) => {
        const isFirstItem = index === 0;
        const isLastItem = index === filters.length - 1;

        return (
          <View key={filter.id}>
            <TouchableOpacity
              activeOpacity={1}
              ref={element => registerRef(filter.id, element)}
              accessible={true}
              role="button"
              aria-label={filter.title}
              aria-expanded={expandedFilter === filter.id}
              accessibilityHint={`Open ${filter.title} filter options`}
              style={[
                styles.filterItem,
                getCurrentFocused() === filter.id
                  ? styles.filterItemFocused
                  : null,
              ]}
              onPress={() => handleFilterPress(filter.id)}
              onFocus={() => focusItem(filter.id)}
              onBlur={() => {
                blurItem(filter.id);
                logDebug(`Blurred: ${filter.id}`);
              }}
              nextFocusDown={
                isLastItem && closeButtonFocus.ref.current
                  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (findNodeHandle(closeButtonFocus.ref.current as any) ??
                    undefined)
                  : undefined
              }
              hasTVPreferredFocus={isFirstItem && isOpen}
            >
              <Text style={styles.filterText}>{filter.title}</Text>
              {filter.subFilters && (
                <Text style={styles.arrow}>
                  {expandedFilter === filter.id ? '▲' : '▼'}
                </Text>
              )}
            </TouchableOpacity>

            {expandedFilter === filter.id && filter.subFilters && (
              <View style={styles.subFiltersContainer}>
                {filter.subFilters.map(subFilter => (
                  <TouchableOpacity
                    activeOpacity={1}
                    role="button"
                    key={subFilter.id}
                    ref={element => registerRef(subFilter.id, element)}
                    style={[
                      styles.subFilterItem,
                      getCurrentFocused() === subFilter.id
                        ? styles.filterItemFocused
                        : null,
                    ]}
                    onPress={() => logDebug(`Selected: ${subFilter.label}`)}
                    onFocus={() => focusItem(subFilter.id)}
                    onBlur={() => logDebug(`Blurred: ${subFilter.id}`)}
                  >
                    <Text style={styles.subFilterText}>{subFilter.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        );
      })}

      <TouchableOpacity
        activeOpacity={1}
        ref={closeButtonFocus.ref}
        accessible={true}
        role="button"
        aria-label="Close filters"
        onPress={closeDrawer}
        style={[
          styles.closeButton,
          closeButtonFocus.isFocused ? styles.closeButtonFocused : null,
        ]}
        onFocus={() => closeButtonFocus.focus()}
        onBlur={() => closeButtonFocus.blur()}
      >
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};
