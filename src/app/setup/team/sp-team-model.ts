import { ServiceProviderModel } from 'src/app/model/service-provider-model';
import { SpMemberModel } from '../members/member-model';
import { VehicleModel } from '../vehicle/vehicle-model';
import { SpTeamMembersModel } from './team-members/team-members/sp-team-member-model';


export class SpTeamModel{
  constructor(
    public sp: ServiceProviderModel,
    public manager: SpMemberModel,
    public gnVehicle?: VehicleModel,
    public id?: number,
    public descAr?: string,
    public descEn?: string,
    public startDate?: Date,
    public endDate?: Date,
    public activeFlag?: string,
    public slTeamMember?: SpTeamMembersModel[]
  ){}
}
