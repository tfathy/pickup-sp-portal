export class SubRequestAttachment {
  constructor(
    public subRequestId?: number,
    public attachType?: string,
    public fileName?: string,
    public fileType?: string,
    public fileSize?: number,
    public notes?: string
  ) {}
}
