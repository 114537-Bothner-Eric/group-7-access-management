import { Routes } from '@angular/router';
import { VisitorListComponent } from './visitor/features/visitor-list/visitor-list.component';
import { VisitorFormComponent } from './visitor/features/visitor-form/visitor-form.component';
import { QrComponent } from './qr/features/qr/qr.component';
import { AuthorizedRangeFormComponent } from './authorization/features/authorized-range-form/authorized-range-form.component';
import { AccessQueryComponent } from './accesses/features/access-query/access-query.component';
import { ListAuthComponent } from './authorization/features/list-auth/list-auth.component';
import {AuthorizedFormComponent} from "./authorization/features/authorized-form/authorized-form.component";

export const routes: Routes = [
  {
    path: 'visitors',
    component: VisitorListComponent,
  },
  {
    path: 'visitor/add',
    component: VisitorFormComponent,
  },
  {
    path: 'visitor/edit/:id',
    component: VisitorFormComponent,
  },
  {
    path: 'qr',
    component: QrComponent,
  },
  {
    path: 'register-range',
    component: AuthorizedRangeFormComponent,
  },
  {
    path: 'access-query',
    component: AccessQueryComponent,
  },
  {
    path: 'new/auth',
    component: AuthorizedFormComponent,
  },
  {
    path: 'auth-list',
    component: ListAuthComponent,
  },
  {
    path: 'access-form',
    component: AccessFormComponent,
  },
  {
    path: '',
    redirectTo: '/visitors',
    pathMatch: 'full',
  },
];
