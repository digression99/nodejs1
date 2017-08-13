import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from '../components/dashboard/dashboard.component';
import {HeroesComponent} from '../components/heroes/heroes.component';
import {HeroDetailComponent} from '../components/hero-detail/hero-detail.component';

const appRoutes : Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {path : 'heroes', component : HeroesComponent},
  {path : 'dashboard', component: DashboardComponent},
  {path : 'detail/:id', component : HeroDetailComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports : [
    RouterModule
  ],
  declarations: []
})




export class RoutingModule { }
