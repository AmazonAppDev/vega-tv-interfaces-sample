import type { ButtonTokens } from '@amazon-devices/kepler-ui-components';

import type { ThemeColors } from '@AppTheme';
import { darkPalette, lightPalette } from '@AppTheme/palette';
import { scale } from '@AppUtils/scale';

const size = {
  height: {
    sm: scale(76),
    md: scale(84),
    lg: scale(92),
    xl: scale(120),
  },
  horizontalPadding: {
    sm: scale(18),
    md: scale(18),
    lg: scale(20),
    xl: scale(24),
  },
  borderWidth: {
    sm: scale(4),
    md: scale(4),
    lg: scale(5),
    xl: scale(5),
  },
  borderRadius: {
    sm: scale(8),
    md: scale(8),
    lg: scale(8),
    xl: scale(8),
  },
  margin: {
    sm: scale(6),
    md: scale(10),
    lg: scale(14),
    xl: scale(18),
  },
  fontSize: {
    sm: scale(22),
    md: scale(24),
    lg: scale(32),
    xl: scale(32),
  },
} as const;

const text = {
  fontFamily: 'Amazon Ember',
  fontWeight: '700',
} as const;

const makeButtonTokens = (palette: ThemeColors): Partial<ButtonTokens> => ({
  container: {
    color: {
      backgroundColor: {
        primary: {
          contained: {
            enabled: palette.primary,
            pressed: palette.primaryFixed,
            disabled: palette.primaryFixedDim,
          },
          outlined: {},
          transparent: {},
        },
        secondary: {
          contained: {
            enabled: palette.secondary,
            pressed: palette.secondaryFixed,
            disabled: palette.secondaryFixedDim,
          },
          outlined: {
            enabled: palette.transparent,
            pressed: palette.transparent,
            disabled: palette.transparent,
          },
          transparent: {},
        },
        tertiary: {
          contained: {
            enabled: palette.tertiary,
            pressed: palette.tertiaryFixed,
            disabled: palette.tertiaryFixedDim,
          },
          outlined: {},
          transparent: {},
        },
        warning: {
          contained: {
            enabled: palette.warning,
            pressed: palette.warningFixed,
            disabled: palette.warningFixedDim,
          },
          outlined: {},
          transparent: {},
        },
        error: {
          contained: {
            enabled: palette.secondary,
            pressed: palette.warningFixed,
            disabled: palette.warningFixedDim,
          },
          outlined: {},
          transparent: {},
        },
      },
      borderColor: {
        primary: {
          contained: {
            enabled: palette.transparent,
            pressed: palette.onPrimaryFixed,
            disabled: palette.onPrimaryFixedVariant,
            focused: palette.onBackground,
          },
          outlined: {
            enabled: palette.primary,
            focused: palette.focusPrimary,
          },
          transparent: {
            focused: palette.focusPrimary,
          },
        },
        secondary: {
          contained: {
            enabled: palette.transparent,
            pressed: palette.onSecondaryFixed,
            disabled: palette.onSecondaryFixedVariant,
            focused: palette.focusPrimary,
          },
          outlined: {
            enabled: palette.secondary,
            focused: palette.focusPrimary,
          },
          transparent: {
            focused: palette.focusPrimary,
          },
        },
        tertiary: {
          contained: {
            enabled: palette.transparent,
            pressed: palette.onTertiaryFixed,
            disabled: palette.onTertiaryFixedVariant,
            focused: palette.focusPrimary,
          },
          outlined: {
            enabled: palette.tertiary,
          },
          transparent: {},
        },
        warning: {
          contained: {
            enabled: palette.transparent,
            pressed: palette.onWarningFixed,
            disabled: palette.onWarningFixedVariant,
            focused: palette.focusPrimary,
          },
          outlined: {
            enabled: palette.warning,
          },
          transparent: {},
        },
        error: {
          contained: {
            enabled: palette.transparent,
            pressed: palette.transparent,
            disabled: palette.onErrorFixedVariant,
            focused: palette.onError,
          },
          outlined: {
            enabled: palette.error,
            focused: palette.focusPrimary,
          },
          transparent: {
            focused: palette.focusPrimary,
          },
        },
      },
      textColor: {
        primary: {
          contained: {
            enabled: palette.onPrimary,
            pressed: palette.onPrimaryFixedVariant,
            disabled: palette.onPrimaryFixed,
          },
          outlined: {
            enabled: palette.primary,
            focused: palette.primary,
          },
          transparent: {
            enabled: palette.primary,
            focused: palette.primary,
          },
        },
        secondary: {
          contained: {
            enabled: palette.onSecondary,
            pressed: palette.onSecondaryFixedVariant,
            disabled: palette.onSecondaryFixed,
          },
          outlined: {
            enabled: palette.secondary,
            focused: palette.secondary,
          },
          transparent: {
            enabled: palette.secondary,
            focused: palette.secondary,
          },
        },
        tertiary: {
          contained: {
            enabled: palette.onTertiary,
            pressed: palette.onTertiaryFixedVariant,
            disabled: palette.onTertiaryFixed,
          },
          outlined: {
            enabled: palette.tertiary,
          },
          transparent: {
            enabled: palette.tertiary,
          },
        },
        warning: {
          contained: {
            enabled: palette.onWarning,
            pressed: palette.onWarningFixedVariant,
            disabled: palette.onWarningFixed,
          },
          outlined: {
            enabled: palette.warning,
          },
          transparent: {
            enabled: palette.warning,
          },
        },
        error: {
          contained: {
            enabled: palette.onError,
            pressed: palette.onErrorFixedVariant,
            disabled: palette.onErrorFixed,
          },
          outlined: {
            enabled: palette.error,
          },
          transparent: {
            enabled: palette.error,
          },
        },
      },
    },
    size,
    text,
  },
});

export const buttonTokensLight = makeButtonTokens(lightPalette);
export const buttonTokensDark = makeButtonTokens(darkPalette);
