export interface AesStatic {
  (secret, aesEncryptPassword, iv): string
}

export interface RandomIv {
  (length: number): string
}

export interface WtuEncrypt {
  (password, secret): string
}

declare const encrypt: AesStatic
export const randomStr: RandomIv
export const wtuEncrypt: WtuEncrypt
export default encrypt
