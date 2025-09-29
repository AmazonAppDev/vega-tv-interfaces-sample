import React from 'react';
import { type AccessibilityProps, View } from 'react-native';

import { useThemedStyles } from '@AppTheme';
import { useRerenderOnFocus } from '@AppUtils';
import { Button, Text } from '@AppComponents/core';
import { useTranslation } from '@AppServices/i18n';
import { getDetailsStyles } from './styles';

export type DetailsHeaderProps = {
  detailsContentEndpoint: string;
  itemId: string | undefined;
  title: string | undefined;
  accessibilityHint: AccessibilityProps['accessibilityHint'];
};

export const DetailsHeader = ({
  detailsContentEndpoint,
  itemId,
  title,
  accessibilityHint,
}: DetailsHeaderProps) => {
  const styles = useThemedStyles(getDetailsStyles);
  const { t } = useTranslation();
  const shouldRender = useRerenderOnFocus();

  return (
    shouldRender && (
      <View style={styles.headerContainer}>
        <Text
          variant="headline"
          size="lg"
          style={styles.headerText}
          role="heading"
        >
          {title}
        </Text>
        <Text variant="label" size="sm" style={styles.headerText}>
          {`url: ${detailsContentEndpoint}/${itemId}`}
        </Text>
        <Button
          style={styles.button}
          onPress={() => {}}
          variant="primary"
          label={t('common-play')}
          accessibilityHint={accessibilityHint}
          hasTVPreferredFocus
        />
      </View>
    )
  );
};
