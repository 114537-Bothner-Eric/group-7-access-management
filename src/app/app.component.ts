import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { VisitorFormComponent } from './visitor/features/visitor-form/visitor-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, VisitorFormComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'access-management';
}
