import { ServiceProviderModel } from 'src/app/model/service-provider-model';
import { SpMemberModel } from '../members/member-model';

export class SysOwnerUserModel {
  constructor(
    public sp: ServiceProviderModel,
    public member: SpMemberModel,
    public id?: number,
    public email?: string,
    public encryptedPassword?: string,
    public userType?: string,
    public accountStatus?: string
  ) {}
}
