import 'react-i18next';
import { resources } from '../../app1/i18n/config';

declare module 'react-i18next' {
  type DefaultResources = typeof resources['en'];
  interface Resources extends DefaultResources {}
}
