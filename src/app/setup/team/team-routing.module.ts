import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeamPage } from './team.page';

const routes: Routes = [
  {
    path: '',
    component: TeamPage
  },
  {
    path: 'team-members',
    loadChildren: () => import('./team-members/team-members/team-members.module').then( m => m.TeamMembersPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamPageRoutingModule {}
