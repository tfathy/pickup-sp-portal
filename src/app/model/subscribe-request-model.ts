import { CountryModel } from './country-model';
import { SysOwnerModel } from './sys-owner-model';
import { WhoColumnModel } from './whoColumn-model';

export class SubscriptionRequest{
  constructor(
    public id?: number,
    public reqDate?: Date,
    public requesterType?: string,
    public status?: string,
    public sysOwner?: SysOwnerModel,
    public address?: string,
    public commNumber?: string,
    public companyNameAr?: string,
    public companyNameEn?: string,
    public contactPersonEmail?: string,
    public contactPersonName?: string,
    public contactPersonPhone?: string,
    public gnCountry?: CountryModel,
    public whoColumn?: WhoColumnModel
  ){}
}
