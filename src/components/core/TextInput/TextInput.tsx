import React, { forwardRef } from 'react';
import type { TextInput as RNTextInput, ViewStyle } from 'react-native';
import { View } from 'react-native';

import type { TextInputProps as KeplerTextInputProps } from '@amazon-devices/kepler-ui-components';
import { TextInput as KeplerTextInput } from '@amazon-devices/kepler-ui-components';

import { useThemedStyles } from '@AppTheme';
import { Text } from '../Text';
import { getTextInputStyles } from './styles';

export type TextInputProps = KeplerTextInputProps & {
  error?: string;
  label?: string;
  wrapperStyle?: ViewStyle;
};

export const TextInput = forwardRef<RNTextInput, TextInputProps>(
  (
    {
      error,
      textContainerStyle,
      wrapperStyle,
      outerContainerStyle,
      labelStyle,
      showSoftInputOnFocus = false,
      ...inputProps
    },
    ref,
  ) => {
    const styles = useThemedStyles(getTextInputStyles);

    return (
      <View style={[styles.wrapper, wrapperStyle]}>
        <KeplerTextInput
          // @ts-expect-error
          ref={ref}
          showSoftInputOnFocus={showSoftInputOnFocus}
          textContainerStyle={{
            ...styles.textContainer,
            ...textContainerStyle,
          }}
          outerContainerStyle={{
            ...styles.outerContainer,
            ...outerContainerStyle,
          }}
          labelStyle={{
            ...styles.label,
            ...labelStyle,
          }}
          {...inputProps}
        />
        <View style={styles.errorTextContainer}>
          {error && (
            <Text variant="label" color={styles.errorText.color}>
              {error}
            </Text>
          )}
        </View>
      </View>
    );
  },
);
