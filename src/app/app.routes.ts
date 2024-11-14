import { Routes, CanActivate } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { InfoPageComponent } from './all-page/info-page/info-page.component';

import { WrapperDetailPostComponent } from './all-page/content-page/wrapper-detail-post/wrapper-detail-post.component';
import { WrapperMessageComponent } from './all-page/content-page/wrapper-message/wrapper-message.component';
import { WrapperSearchComponent } from './all-page/content-page/wrapper-search/wrapper-search.component';
import { WrapperNotificationsComponent } from './all-page/content-page/wrapper-notifications/wrapper-notifications.component';
import { AuthGuard } from './auth.guard';

import { NotFoundComponent } from './not-found/not-found.component';

import { WrapperListPostComponent } from './all-page/content-page/wrapper-list-post/wrapper-list-post.component';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: WrapperListPostComponent },
      { path: 'detail/:id', component: WrapperDetailPostComponent },
      {
        path: 'user/:userId/detail/:postId',
        component: WrapperDetailPostComponent,
      },
      { path: 'message', component: WrapperMessageComponent },
      { path: 'search', component: WrapperSearchComponent },
      { path: 'notifications', component: WrapperNotificationsComponent },
      { path: '404', component: NotFoundComponent },
      {
        path: 'user',
        children: [
          {
            path: ':id',
            loadComponent: () =>
              import('./all-page/info-page/info-page.component').then(
                (m) => m.InfoPageComponent
              ),
          },
        ],
      },
      { path: '**', component: NotFoundComponent },
    ],
  },
];
