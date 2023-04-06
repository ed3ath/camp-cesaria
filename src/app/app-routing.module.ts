import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { CheckinComponent } from './checkin/checkin.component';
import { ClaimComponent } from './claim/claim.component';
import { LandingComponent } from './landing/landing.component';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent
  },
  {
    path: 'admin',
    redirectTo: '/admin/home', pathMatch: 'full'
  },
  {
    path: 'admin',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'checkin', component: CheckinComponent },
      { path: 'claim', component: ClaimComponent },
    ]
  },
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
