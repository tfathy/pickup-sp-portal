import { CountryModel } from './country-model';

export class SysOwnerModel {
  constructor(
    public id?: number,
    public descAr?: string,
    public descEn?: string,
    public shortNameAr?: string,
    public shortNameEn?: string,
    public address?: string,
    public gnCountry?: CountryModel
  ) {}
}
