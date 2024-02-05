// cookie操作
import { BaseCookie } from './base';

export { BaseCookie };
export const cookie = new BaseCookie(
  () => document.cookie,
  text => document.cookie = text,
);
