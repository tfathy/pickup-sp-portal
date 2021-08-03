import { ServiceProviderModel } from 'src/app/model/service-provider-model';

export class SpJobModel {
  constructor(
    public sp: ServiceProviderModel,
    public id?: number,
    public descAr?: string,
    public descEn?: string,
    public jobDescription?: string,
    public activeFlag?: string
  ) {}
}
