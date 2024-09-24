import { Routes } from '@angular/router';
import { VisitorListComponent } from './visitor/features/visitor-list/visitor-list.component';

export const routes: Routes = [
    {
        path: 'visitors',
        component: VisitorListComponent
    }
];
