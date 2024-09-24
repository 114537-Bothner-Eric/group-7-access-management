import { Component } from '@angular/core';
import { Visitor, VisitorService } from '../../services/visitor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-visitor-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './visitor-form.component.html',
})
export class VisitorFormComponent {
  visitor: Visitor = { id: 0, name: '', lastname: '', doc_number: '', birth_date: new Date(), is_active: true };

  constructor(
    private visitorService: VisitorService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.visitorService.getVisitor(+id).subscribe(data => this.visitor = data);
    }
  }

  saveVisitor(): void {
    if (this.visitor.id) {
      this.visitorService.updateVisitor(this.visitor).subscribe(() => this.router.navigate(['/visitors']));
    } else {
      this.visitorService.addVisitor(this.visitor).subscribe(() => this.router.navigate(['/visitors']));
    }
  }
}
