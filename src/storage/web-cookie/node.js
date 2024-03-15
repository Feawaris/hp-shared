import { BaseCookie } from './base';

export { BaseCookie };
export class NodeCookie extends BaseCookie {
  constructor(req, res) {
    super(
      () => req.headers.cookie,
      (text) => {
        const arr = res.getHeader('Set-Cookie') || [];
        res.setHeader('Set-Cookie', [...arr, text]);
      },
    );
  }
}
