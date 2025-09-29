import React, { forwardRef, useMemo } from 'react';
import type {
  AccessibilityProps,
  PressableProps,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { Pressable, View } from 'react-native';

import { useThemedStyles } from '@AppTheme';
import { useFocusState } from '@AppServices/focusGuide';
import { useTranslation } from '@AppServices/i18n';
import { Text } from '../Text';
import { AvatarImage } from './AvatarImage';
import { getAvatarStyles } from './styles';

export type AvatarRef = View;

export type AvatarProps = {
  size?: number;
  image?: string;
  placeholder: string;
  onPress?: PressableProps['onPress'];
  hasTVPreferredFocus?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  isCircle?: boolean;
  label?: string;
  wrapperStyles?: ViewStyle;
  wrapperStylesFocused?: ViewStyle;
  imageWrapperStyles?: ViewStyle;
  labelStyles?: TextStyle;
  testID?: string;
} & AccessibilityProps;

export const Avatar = forwardRef<AvatarRef, AvatarProps>(
  (
    {
      size = 50,
      image,
      placeholder,
      onPress,
      hasTVPreferredFocus = false,
      onFocus,
      onBlur,
      isCircle = false,
      label,
      imageWrapperStyles,
      labelStyles,
      wrapperStyles,
      wrapperStylesFocused,
      testID = 'avatar',
      ...a11yProps
    },
    ref,
  ) => {
    const { t } = useTranslation();

    const { handleBlur, handleFocus, isFocused } = useFocusState({
      onFocus,
      onBlur,
      initialState: hasTVPreferredFocus,
    });
    const styles = useThemedStyles(getAvatarStyles);
    const wrapperSize = useMemo(
      () => ({
        width: size,
        height: size,
        borderRadius: isCircle ? size / 2 : size / 10,
      }),
      [size, isCircle],
    );

    const placeholderStyles: Pick<TextStyle, 'fontSize' | 'lineHeight'> =
      useMemo(() => {
        const textSize = size / 2;

        return {
          fontSize: textSize,
          lineHeight: textSize,
        };
      }, [size]);

    return (
      <Pressable
        ref={ref}
        role="button"
        style={[
          styles.wrapper,
          wrapperStyles,
          isFocused && wrapperStylesFocused,
        ]}
        onPress={onPress}
        onFocus={handleFocus}
        hasTVPreferredFocus={hasTVPreferredFocus}
        onBlur={handleBlur}
        testID={testID}
        {...a11yProps}
        // override aria-label from a11yProps
        aria-label={
          a11yProps['aria-label'] ??
          t('avatar-a11y-label').replace('<placeholder>', placeholder)
        }
      >
        <View
          testID={`${testID}-image-wrapper`}
          style={[
            styles.imageWrapper,
            wrapperSize,
            imageWrapperStyles,
            isFocused && styles.imageWrapperFocused,
          ]}
          aria-hidden
        >
          {image ? (
            <AvatarImage
              image={image}
              placeholder={placeholder}
              borderRadius={wrapperSize.borderRadius}
            />
          ) : (
            <Text
              style={[
                styles.placeholder,
                placeholderStyles,
                isFocused && styles.placeholderFocused,
              ]}
            >
              {placeholder.length && placeholder[0]
                ? placeholder[0].toUpperCase()
                : '-'}
            </Text>
          )}
        </View>

        {label && (
          <View aria-hidden>
            <Text style={[labelStyles, isFocused && styles.labelFocused]}>
              {label}
            </Text>
          </View>
        )}
      </Pressable>
    );
  },
);
