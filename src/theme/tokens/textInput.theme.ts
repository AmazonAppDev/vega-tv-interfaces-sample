import type { TextInputTokens } from '@amazon-devices/kepler-ui-components';

import type { ThemeColors } from '@AppTheme';
import { darkPalette, lightPalette } from '@AppTheme/palette';
import { scale } from '@AppUtils/scale';

const inputtedTextSize = {
  fontSize: scale(22),
  letterSpacing: 0,
  lineHeight: scale(28),
};
const containerSize = {
  borderRadius: {
    enabled: scale(8),
  },
  borderWidth: {
    enabled: scale(2),
    focused: scale(2),
  },
};

const labelSize = {
  fontSize: scale(18),
  letterSpacing: 0,
  lineHeight: 0,
};

const makeInputTokens = (palette: ThemeColors): Partial<TextInputTokens> => ({
  container: {
    color: {
      backgroundColor: {
        enabled: palette.transparent,
      },
      borderColor: {
        enabled: palette.outlineVariant,
        focused: palette.focusPrimary,
      },
    },
    size: containerSize,
  },
  textContainer: {
    color: {
      backgroundColor: palette.surfaceDim,
    },
    size: {
      borderRadius: scale(8),
    },
  },
  inputtedText: {
    color: {
      textColor: palette.onSurface,
    },
    size: inputtedTextSize,
  },
  label: {
    color: {
      textColor: palette.onBackground,
    },
    size: labelSize,
  },
});

export const inputTokenLight = makeInputTokens(lightPalette);

export const inputTokenDark = makeInputTokens(darkPalette);
