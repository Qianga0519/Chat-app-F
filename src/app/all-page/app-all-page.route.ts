import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentPageComponent } from './content-page/content-page.component';
import { InfoPageComponent } from './info-page/info-page.component';

export const routesAllPage: Routes = [
  { 
    path: '',
    children: [
      { 
        path: '',
        loadChildren: () => import('./content-page/page-content.route').then((r) => r.routesPageContent)
      },
      {path: 'user/:id', component: InfoPageComponent},
      {path: 'user/', component: InfoPageComponent}
    ]
  }
];

