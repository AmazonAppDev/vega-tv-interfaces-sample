/* eslint-disable max-lines */
import React, { useCallback } from 'react';
import type { StyleProp, ViewStyle, View } from 'react-native';
import { Platform, TouchableOpacity } from 'react-native';

import type { HWEvent } from '@amazon-devices/react-native-kepler';
import { TVEventHandler } from '@amazon-devices/react-native-kepler';

import { useThemedStyles } from '@AppTheme';
import { getBoxStyles } from './style';

// ============= State Types & Hook =============
export const BOX_STATE = {
  DEFAULT: 'default',
  ENABLED: 'enabled',
  ACTIVE: 'active',
  PRESSED: 'pressed',
  DISABLED: 'disabled',
  FOCUSED: 'focused',
} as const;

type BoxState = (typeof BOX_STATE)[keyof typeof BOX_STATE];
type StateMap = Record<BoxState, boolean>;

const DEFAULT_STATE: StateMap = {
  [BOX_STATE.DISABLED]: false,
  [BOX_STATE.ENABLED]: true,
  [BOX_STATE.DEFAULT]: false,
  [BOX_STATE.ACTIVE]: false,
  [BOX_STATE.PRESSED]: false,
  [BOX_STATE.FOCUSED]: false,
};

function useBoxState(initialState = DEFAULT_STATE) {
  const [state, updateState] = React.useState(initialState);
  const pressHandler = React.useRef<null | TVEventHandler>(null);

  const enablePressHandler = React.useCallback(() => {
    if (!pressHandler.current && Platform.isTV) {
      pressHandler.current = new TVEventHandler();
      pressHandler.current.enable(undefined, DPADPressHandler);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const disablePressHandler = React.useCallback(() => {
    pressHandler.current?.disable();
    pressHandler.current = null;
  }, []);

  const setState = React.useCallback(
    (targetState: BoxState, status: boolean) => {
      if (targetState === BOX_STATE.FOCUSED) {
        if (status) {
          enablePressHandler();
        } else {
          disablePressHandler();
        }
      }
      updateState(prevState => ({
        ...prevState,
        [targetState]: status,
      }));
    },
    [disablePressHandler, enablePressHandler],
  );

  const DPADPressHandler = React.useCallback(
    (_: unknown, event?: HWEvent) => {
      if (event?.eventType === 'select' && event?.eventKeyAction === 0) {
        setState(BOX_STATE.PRESSED, true);
      } else if (event?.eventType === 'select' && event?.eventKeyAction === 1) {
        setState(BOX_STATE.PRESSED, false);
      }
    },
    [setState],
  );

  // Cleanup cuando el `Box` se desmonta
  React.useEffect(() => {
    return () => {
      disablePressHandler();
    };
  }, [disablePressHandler]);

  return { state, setState };
}

// ============= Accessibility Types =============
export type AccessibilityRole =
  | 'none'
  | 'button'
  | 'link'
  | 'search'
  | 'image'
  | 'keyboardkey'
  | 'text'
  | 'adjustable'
  | 'header'
  | 'summary'
  | 'alert'
  | 'checkbox'
  | 'combobox'
  | 'menu'
  | 'menubar'
  | 'menuitem'
  | 'progressbar'
  | 'radio'
  | 'radiogroup'
  | 'scrollbar'
  | 'spinbutton'
  | 'switch'
  | 'tab'
  | 'tablist'
  | 'timer'
  | 'toolbar';

export interface AccessibilityState {
  disabled?: boolean;
  selected?: boolean;
  checked?: boolean | 'mixed';
  busy?: boolean;
  expanded?: boolean;
  pressed?: boolean;
}

export interface AccessibilityValue {
  min?: number;
  max?: number;
  now?: number;
  text?: string;
}

export interface AccessibilityAction {
  name: string;
  label?: string;
}

export interface AccessibilityProps {
  accessible?: boolean;
  accessibilityRole?: AccessibilityRole;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityState?: AccessibilityState;
  accessibilityValue?: AccessibilityValue;
  accessibilityActions?: AccessibilityAction[];
  onAccessibilityAction?: (event: {
    nativeEvent: { actionName: string };
  }) => void;
  accessibilityElementsHidden?: boolean;
  accessibilityViewIsModal?: boolean;
  accessibilityLiveRegion?: 'none' | 'polite' | 'assertive';
  importantForAccessibility?: 'auto' | 'yes' | 'no' | 'no-hide-descendants';
  accessibilityLanguage?: string;
  accessibilityIgnoresInvertColors?: boolean;
}

// ============= Theme Types =============
export type BoxVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'outlined'
  | 'ghost';
export type BoxSize = 'sm' | 'md' | 'lg';

export interface BoxTheme {
  variants: Record<BoxVariant, ViewStyle>;
  sizes: Record<BoxSize, ViewStyle>;
  focused: ViewStyle;
  pressed: ViewStyle;
  disabled: ViewStyle;
}

// ============= Box Component Types =============
const isTV = Platform.isTV;

interface TVProps {
  hasTVPreferredFocus?: boolean;
  isTVSelectable?: boolean;
  nextFocusDown?: number;
  nextFocusUp?: number;
  nextFocusLeft?: number;
  nextFocusRight?: number;
}

interface BaseBoxProps extends AccessibilityProps, TVProps {
  children?: React.ReactNode;
  variant?: BoxVariant;
  size?: BoxSize;
  focusable?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  focusStyle?: StyleProp<ViewStyle>;
  pressableStyle?: StyleProp<ViewStyle>;
  _activeOpacity?: number;
  testID?: string;
  elevation?: number;
  onFocus?: (event?: React.FocusEvent<View>) => void;
  onBlur?: (event?: React.FocusEvent<View>) => void;
}

interface BoxWithPressProps extends BaseBoxProps {
  onPress: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  onLongPress?: () => void;
}

type BoxProps = BaseBoxProps & Partial<BoxWithPressProps> & TVProps;

// ============= Box Component =============
export const Box = React.forwardRef<TouchableOpacity, BoxProps>(
  (
    {
      children,
      variant = 'default',
      size = 'md',
      focusable = true,
      disabled = false,
      style,
      focusStyle,
      pressableStyle,
      _activeOpacity,
      testID,
      elevation,
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const styles = useThemedStyles(getBoxStyles);

    const { state, setState } = useBoxState({
      [BOX_STATE.DISABLED]: disabled,
      [BOX_STATE.ENABLED]: !disabled,
      [BOX_STATE.DEFAULT]: false,
      [BOX_STATE.ACTIVE]: false,
      [BOX_STATE.PRESSED]: false,
      [BOX_STATE.FOCUSED]: false,
    });

    const accessibilityState = React.useMemo(
      () => ({
        disabled,
        busy: state[BOX_STATE.PRESSED],
      }),
      [disabled, state],
    );

    const defaultRole = React.useMemo(() => {
      if ('onPress' in rest) {
        return 'button';
      }
      return 'none';
    }, [rest]);

    const handleFocus = useCallback(() => {
      setState(BOX_STATE.FOCUSED, true);
      onFocus?.();
    }, [onFocus, setState]);

    const handleBlur = useCallback(() => {
      setState(BOX_STATE.FOCUSED, false);
      onBlur?.();
    }, [onBlur, setState]);

    const handlePress = useCallback(() => {
      if (disabled) {
        return;
      }

      setState(BOX_STATE.FOCUSED, false);
      setState(BOX_STATE.PRESSED, true);

      if ('onPress' in rest && typeof rest.onPress === 'function') {
        rest.onPress();
      }
    }, [disabled, setState, rest]);

    const handlePressIn = useCallback(() => {
      if (!disabled) {
        setState(BOX_STATE.PRESSED, true);
        setState(BOX_STATE.FOCUSED, false);
        if ('onPressIn' in rest) {
          rest.onPressIn?.();
        }
      }
    }, [disabled, setState, rest]);

    const handlePressOut = useCallback(() => {
      if (!disabled) {
        setState(BOX_STATE.PRESSED, false);
        if ('onPressOut' in rest) {
          rest.onPressOut?.();
        }
      }
    }, [disabled, setState, rest]);

    const boxStyle = [
      styles[variant],
      styles[size],
      disabled && styles.disabled,
      state[BOX_STATE.FOCUSED] && styles.focused,
      state[BOX_STATE.PRESSED] && styles.pressed,
      style,
      state[BOX_STATE.FOCUSED] && focusStyle,
      state[BOX_STATE.PRESSED] && pressableStyle,
      Platform.OS === 'android' && {
        elevation: elevation ?? 0,
      },
    ];

    const accessibilityProps: AccessibilityProps = {
      accessible: true,
      accessibilityRole: defaultRole,
      accessibilityState,
      ...rest,
    };

    const tvProps = {
      hasTVPreferredFocus: rest.hasTVPreferredFocus,
      isTVSelectable: rest.isTVSelectable,
      nextFocusDown: rest.nextFocusDown,
      nextFocusUp: rest.nextFocusUp,
      nextFocusLeft: rest.nextFocusLeft,
      nextFocusRight: rest.nextFocusRight,
    };

    if (isTV && focusable) {
      return (
        <TouchableOpacity
          ref={ref}
          aria-label={rest.accessibilityLabel}
          {...tvProps}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={disabled ? undefined : handlePress}
          disabled={disabled}
          testID={testID}
          style={boxStyle}
          activeOpacity={_activeOpacity ?? 1}
          {...rest}
        >
          {children}
        </TouchableOpacity>
      );
    }

    if ('onPress' in rest) {
      return (
        <TouchableOpacity
          ref={ref}
          aria-label={rest.accessibilityLabel}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={disabled ? undefined : handlePress}
          disabled={disabled}
          testID={testID}
          style={boxStyle}
          activeOpacity={_activeOpacity ?? 1}
          {...rest}
        >
          {children}
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        ref={ref}
        {...accessibilityProps}
        style={boxStyle}
        testID={testID}
        activeOpacity={_activeOpacity ?? 1}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-label={rest.accessibilityLabel}
        role={defaultRole}
        {...rest}
      >
        {children}
      </TouchableOpacity>
    );
  },
);
