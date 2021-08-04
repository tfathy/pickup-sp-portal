import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'landing',
    loadChildren: () =>
      import('./landing/landing.module').then((m) => m.LandingPageModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'subscribe-request',
    loadChildren: () =>
      import('./subscribe-request/subscribe-request.module').then(
        (m) => m.SubscribeRequestPageModule
      ),
  },
  {
    path: 'setup-home',
    loadChildren: () =>
      import('./setup/setup-home/setup-home.module').then(
        (m) => m.SetupHomePageModule
      ),
    canLoad: [AuthGuard],
  },
  {
    path: 'vehicle',
    loadChildren: () =>
      import('./setup/vehicle/vehicle.module').then((m) => m.VehiclePageModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'my-services',
    loadChildren: () =>
      import('./setup/my-services/my-services.module').then(
        (m) => m.MyServicesPageModule
      ),
    canLoad: [AuthGuard],
  },
  {
    path: 'members',
    loadChildren: () =>
      import('./setup/members/members.module').then((m) => m.MembersPageModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'team',
    loadChildren: () =>
      import('./setup/team/team.module').then((m) => m.TeamPageModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./setup/users/users.module').then((m) => m.UsersPageModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'sp-job',
    loadChildren: () =>
      import('./setup/sp-job/sp-job.module').then((m) => m.SpJobPageModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'change-password',
    loadChildren: () =>
      import('./setup/change-password/change-password.module').then(
        (m) => m.ChangePasswordPageModule
      ),
    canLoad: [AuthGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
