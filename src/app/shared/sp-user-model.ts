import { ServiceProviderModel } from '../model/service-provider-model';

export class SpUserModel {
  constructor(
    public id?: number,
    public sp?: ServiceProviderModel,
    public email?: string,
    public encryptedPassword?: string,
    public userType?: string,
    public accountStatus?: string
  ){}
}
