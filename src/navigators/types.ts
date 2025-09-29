import type { RouteProp } from '@amazon-devices/react-navigation__core';
import type { NavigatorScreenParams } from '@amazon-devices/react-navigation__core';

export type DetailsParams = {
  endpoint: undefined;
  itemId: string;
};

export type ComponentsNavigatorParamList = {
  Components: undefined;
  VerticalStack: undefined;
  BrowseStack: undefined;
};

export type MainNavigatorParamList = {
  Drawer: undefined;
  Home: undefined;
  Details: DetailsParams;
  Settings: undefined;
  SettingsLanguage: undefined;
  Components: NavigatorScreenParams<ComponentsNavigatorParamList>;
};

export type AppMainRouteProps<T extends keyof MainNavigatorParamList> =
  RouteProp<MainNavigatorParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends Partial<MainNavigatorParamList> {}
  }
}
