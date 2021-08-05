import { ServiceProviderModel } from 'src/app/model/service-provider-model';
import { SpMemberModel } from '../members/member-model';

export class CreateUserModel {
  constructor(
    public sp: ServiceProviderModel,
    public member: SpMemberModel,
    public email?: string,
    public password?: string,
    public userType?: string,
    public accountStatus?: string
  ) {}
}
