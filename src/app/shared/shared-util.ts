/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { Storage } from '@capacitor/storage';

export async function readStorage(key: string): Promise<any> {
  const item = await Storage.get({ key });
  return JSON.parse(item.value);
}

export interface spAuthToken {
  userId: string;
  token: string;
  tokenExpirationDate: string;
  email: string;
  fullnameEn: string;
  fullNameAr: string;
  userType: string;
  accountStatus: string;
}
