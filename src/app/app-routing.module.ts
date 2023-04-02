import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { CheckinComponent } from './checkin/checkin.component';
import { ClaimComponent } from './claim/claim.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'checkin', component: CheckinComponent },
  { path: 'claim', component: ClaimComponent },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
