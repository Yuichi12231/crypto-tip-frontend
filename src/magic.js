
import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';

export const magic = new Magic('pk_live_CBB4E24015C02A64', {
  extensions: [new OAuthExtension()],
});
