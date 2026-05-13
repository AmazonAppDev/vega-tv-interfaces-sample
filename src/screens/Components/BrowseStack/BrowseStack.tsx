import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { ScreenContainer } from '@AppComponents';
import { useThemedStyles } from '@AppTheme';
import { Grid } from '@AppComponents/Grid/Grid';
import { Browse } from '@AppComponents/browse';
import { FocusGuideView } from '@AppServices/focusGuide';
import { useTVFocus } from '@AppSrc/hooks';
import { useVerticalPosters } from '@AppSrc/hooks/useVerticalPosters';
import { getBrowseStackStyles } from './styles';

export const BrowseStack = () => {
  const browseStackRef = useRef<View>(null);
  const styles = useThemedStyles(getBrowseStackStyles);

  const {
    items,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useVerticalPosters();

  const handleLoadMore = React.useCallback(() => {
    if (hasNextPage && !isFetching) {
      void fetchNextPage();
    }
  }, [hasNextPage, isFetching, fetchNextPage]);

  const { registerDestination, unregisterDestination, getNativeDestinations } =
    useTVFocus();

  useEffect(() => {
    registerDestination('browseStack', browseStackRef as React.RefObject<View>);

    return () => {
      unregisterDestination('browseStack');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScreenContainer testID="components" style={[styles.screenContainer]}>
      <FocusGuideView
        style={[styles.container]}
        destinations={getNativeDestinations(['browseStack'])}
      >
        <View ref={browseStackRef}>
          <Browse />
        </View>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Grid
            items={items}
            onEndReached={handleLoadMore}
            isLoading={isLoading}
            isFetching={isFetching}
            isFetchingNextPage={isFetchingNextPage}
          />
        )}
      </FocusGuideView>
    </ScreenContainer>
  );
};
