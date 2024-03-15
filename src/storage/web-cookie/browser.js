import { BaseCookie } from './base';

export { BaseCookie };
export const cookie = new BaseCookie(
  () => document.cookie,
  text => (document.cookie = text),
);
