// src/@types/jsonwebtoken.d.ts
declare module 'jsonwebtoken' {
  export interface JwtPayload {
    [key: string]: any;
  }

  export function sign(payload: string | object | Buffer, secretOrPrivateKey: string, options?: object): string;
  export function verify(token: string, secretOrPublicKey: string, options?: object): JwtPayload | string;
}
