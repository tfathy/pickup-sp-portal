import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpJobPage } from './sp-job.page';

const routes: Routes = [
  {
    path: '',
    component: SpJobPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpJobPageRoutingModule {}
