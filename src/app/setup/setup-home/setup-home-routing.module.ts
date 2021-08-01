import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetupHomePage } from './setup-home.page';

const routes: Routes = [
  {
    path: '',
    component: SetupHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetupHomePageRoutingModule {}
