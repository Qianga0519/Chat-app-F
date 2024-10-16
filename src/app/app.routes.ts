// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { LoginComponent } from './login/login.component';
// import { RegisterComponent } from './register/register.component';

// export const routes: Routes = [
//   { path: 'login', component: LoginComponent },
//   { path: 'register', component: RegisterComponent },
//   { path: '',
//     loadChildren: () => import('./all-page/content-page/content-page.component').then((r) => r.routesAllPage)
//   }
// ];

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AllPageComponent } from './all-page/all-page.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: '',
    loadChildren: () => import('./all-page/app-all-page.route').then((r) => r.routesAllPage)
  }
];
