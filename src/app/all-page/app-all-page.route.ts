import { Routes } from '@angular/router';

import { InfoPageComponent } from './info-page/info-page.component'; // Import InfoPageComponent

import { HttpClient } from '@angular/common/http';

export const routesAllPage: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./content-page/page-content.route').then(
            (r) => r.routesPageContent // Đảm bảo routesPageContent là một Routes hợp lệ
          ),
         
      },
      {
        path: 'user',
        component: InfoPageComponent, // Component cho route này
       
      },
    ],
  },
];
