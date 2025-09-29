import type { ReactElement } from 'react';
import React from 'react';
import type { StyleProp, ViewStyle, ViewProps } from 'react-native';
import { View } from 'react-native';

import { useThemedStyles } from '@AppSrc/theme';
import { getScreenContainerStyles } from './styles';

export type ScreenContainerProps = {
  testID: ViewProps['testID'];
  children: ReactElement | ReactElement[];
  style?: StyleProp<ViewStyle>;
};

const testId = 'screencontainer';

export const ScreenContainer = ({
  testID = testId,
  style,
  children,
}: ScreenContainerProps) => {
  const styles = useThemedStyles(getScreenContainerStyles);

  return (
    <View testID={testID} style={[styles.container, style]}>
      {children}
    </View>
  );
};
