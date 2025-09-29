import { createThemeFromPartialTheme } from '@amazon-devices/kepler-ui-components';

import { darkPalette, lightPalette } from '@AppTheme/palette';
import {
  buttonTokensDark,
  buttonTokensLight,
} from '@AppTheme/tokens/button.theme';
import {
  inputTokenDark,
  inputTokenLight,
} from '@AppTheme/tokens/textInput.theme';
import {
  typographyTokensDark,
  typographyTokensLight,
} from '@AppTheme/tokens/typography.theme';
import type { InternalKeplerTheme } from '@AppTheme/types';

export const lightTheme = createThemeFromPartialTheme<InternalKeplerTheme>({
  metadata: {
    id: 'kepler-app-templates-light-theme',
    type: 'light',
  },
  button: buttonTokensLight,
  textInput: inputTokenLight,
  colors: lightPalette,
  typography: typographyTokensLight,
});

export const darkTheme = createThemeFromPartialTheme<InternalKeplerTheme>({
  metadata: {
    id: 'kepler-app-templates-dark-theme',
    type: 'dark',
  },
  button: buttonTokensDark,
  textInput: inputTokenDark,
  colors: darkPalette,
  typography: typographyTokensDark,
});
