import { ServiceProviderModel } from 'src/app/model/service-provider-model';
import { VehicleSizeModel } from 'src/app/model/vehicle-size-model';
import { WhoColumnModel } from 'src/app/model/whoColumn-model';

export class VehicleModel{
  constructor(
    public sp: ServiceProviderModel,
    public gnVehicleSize: VehicleSizeModel,
    public id?: number,
    public code?: string,
    public descEn?: string,
    public descAr?: string,
    public modelYear?: number,
    public modelCompany?: string,
    public licenExpDate?: Date,
    public imageFileName?: string,
    public activeFlag?: string,
    public notes?: string,
    public whoColumn?: WhoColumnModel
      ){}
}
