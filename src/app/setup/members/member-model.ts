import { ServiceProviderModel } from 'src/app/model/service-provider-model';
import { SpJobModel } from '../sp-job/sp-job-model';

export class SpMemberModel{
  constructor(
    public sp: ServiceProviderModel,
    public fullNameAr: string,
    public fullNameEn: string,
    public phoneNum: string,
    public spJob?: SpJobModel,
    public id?: number,
    public email?: string,
    public birthDate?: Date,
    public drivingLicnExpDate?: Date,
    public hireDate?: Date,
    public gender?: string,
    public imageFileName?: string,
    public terminatedFlag?: string
  ){}
}
