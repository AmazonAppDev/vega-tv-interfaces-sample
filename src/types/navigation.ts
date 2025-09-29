import type { DetailsParams } from '@AppSrc/navigators';

declare global {
  namespace ReactNavigation {
    interface RootParamList {
      Details: {
        screen: 'DetailsMain';
        params: DetailsParams;
      };
    }
  }
}
