import { SpMemberModel } from 'src/app/setup/members/member-model';

export class SpTeamMembersModel {
  constructor(
    public teamId: number,
    public id?: number,
    public notes?: string,
    public spMember?: SpMemberModel
  ) {}
}
