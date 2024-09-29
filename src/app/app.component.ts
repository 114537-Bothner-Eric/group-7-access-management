import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { VisitorFormComponent } from './visitor/features/visitor-form/visitor-form.component';
import { VisitorListComponent } from './visitor/features/visitor-list/visitor-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, VisitorListComponent, VisitorFormComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'access-management';
}
