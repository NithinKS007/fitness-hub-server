import {
  ErrorCode,
  ErrorInfo,
} from "@application/dtos/service/video-call.service";
import { validationError } from "@presentation/middlewares/error.middleware";
import { createCipheriv } from "crypto";
import dotenv from "dotenv";
dotenv.config();

if (
  !process.env.ZEGOCLOUD_APP_ID ||
  isNaN(Number(process.env.ZEGOCLOUD_APP_ID))
) {
  throw new validationError(
    "Invalid or missing ZEGO_APP_ID in environment variables."
  );
}

if (!process.env.ZEGOCLOUD_SERVER_SECRET) {
  throw new validationError(
    "ZEGO_SERVER_SECRET is missing in environment variables."
  );
}

const RndNum = (a: any, b: any) => {
  return Math.ceil((a + (b - a)) * Math.random());
};

const makeNonce = () => {
  return RndNum(-2147483648, 2147483647);
};

const makeRandomIv = (): string => {
  const str = "0123456789abcdefghijklmnopqrstuvwxyz";
  const result = [];
  for (let i = 0; i < 16; i++) {
    const r = Math.floor(Math.random() * str.length);
    result.push(str.charAt(r));
  }
  return result.join("");
};

const getAlgorithm = (keyBase64: string): string => {
  const key = Buffer.from(keyBase64);
  switch (key.length) {
    case 16:
      return "aes-128-cbc";
    case 24:
      return "aes-192-cbc";
    case 32:
      return "aes-256-cbc";
  }

  throw new Error("Invalid key length: " + key.length);
};

// AES encryption, using mode: CBC/PKCS5Padding
const aesEncrypt = (
  plainText: string,
  key: string,
  iv: string
): ArrayBuffer => {
  const cipher = createCipheriv(getAlgorithm(key), key, iv);
  cipher.setAutoPadding(true);
  const encrypted = cipher.update(plainText);
  const final = cipher.final();
  const out = Buffer.concat([encrypted, final]);

  return Uint8Array.from(out).buffer;
};

export const DEFAULT_EXPIRY = 3600;

export const ZEGO_APP_ID = Number(process.env.ZEGOCLOUD_APP_ID);
export const ZEGO_SERVER_SECRET = process.env.ZEGOCLOUD_SERVER_SECRET;

export const generateToken04 = (
  appId: number,
  userId: string,
  secret: string,
  effectiveTimeInSeconds: number,
  payload?: string
): string => {
  if (!appId || typeof appId !== "number") {
    throw {
      errorCode: ErrorCode.appIDInvalid,
      errorMessage: "appID invalid",
    } as ErrorInfo;
  }

  if (!userId || typeof userId !== "string") {
    throw {
      errorCode: ErrorCode.userIDInvalid,
      errorMessage: "userId invalid",
    } as ErrorInfo;
  }

  if (!secret || typeof secret !== "string" || secret.length !== 32) {
    throw {
      errorCode: ErrorCode.secretInvalid,
      errorMessage: "secret must be a 32 byte string",
    } as ErrorInfo;
  }

  if (!effectiveTimeInSeconds || typeof effectiveTimeInSeconds !== "number") {
    throw {
      errorCode: ErrorCode.effectiveTimeInSecondsInvalid,
      errorMessage: "effectiveTimeInSeconds invalid",
    } as ErrorInfo;
  }

  const createTime = Math.floor(new Date().getTime() / 1000);
  const tokenInfo = {
    app_id: appId,
    user_id: userId,
    nonce: makeNonce(),
    ctime: createTime,
    expire: createTime + effectiveTimeInSeconds,
    payload: payload || "",
  };

  const plaintText = JSON.stringify(tokenInfo);
  console.log("plain text: ", plaintText);

  // A randomly generated 16-byte string used as the AES encryption vector,
  // which is Base64 encoded with the ciphertext to generate the final token
  const iv: string = makeRandomIv();
  console.log("iv", iv);

  // Encrypt
  const encryptBuf = aesEncrypt(plaintText, secret, iv);

  // Token binary splicing: expiration time + Base64(iv length + iv + encrypted
  // information length + encrypted information)
  const [b1, b2, b3] = [
    new Uint8Array(8),
    new Uint8Array(2),
    new Uint8Array(2),
  ];
  new DataView(b1.buffer).setBigInt64(0, BigInt(tokenInfo.expire), false);
  new DataView(b2.buffer).setUint16(0, iv.length, false);
  new DataView(b3.buffer).setUint16(0, encryptBuf.byteLength, false);
  const buf = Buffer.concat([
    Buffer.from(b1),
    Buffer.from(b2),
    Buffer.from(iv),
    Buffer.from(b3),
    Buffer.from(encryptBuf),
  ]);
  const dv = new DataView(Uint8Array.from(buf).buffer);
  return "04" + Buffer.from(dv.buffer).toString("base64");
};
