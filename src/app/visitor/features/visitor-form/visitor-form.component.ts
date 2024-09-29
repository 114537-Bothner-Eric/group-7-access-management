import { Component } from '@angular/core';
import { VisitorService } from '../../services/visitor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SendVisitor, Visitor } from '../../models/visitor.model';
import moment from 'moment';

@Component({
  selector: 'app-visitor-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './visitor-form.component.html',
})
export class VisitorFormComponent {
  visitor: SendVisitor = {
    name: '',
    ownerId: 0,
    lastName: '',
    docNumber: '',
    birthDate: new Date(),
    active: true,
  };

  constructor(
    private visitorService: VisitorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.visitorService.getVisitor(+id).subscribe((data) => {
        this.visitor = {
          ...data,
          birthDate: moment(data.birthDate, 'DD-MM-YYYY').toDate(),
        };
      });
    }
  }

  saveVisitor(): void {
    const formattedVisitor = {
      ...this.visitor,
      birthDate: moment(this.visitor.birthDate).format('DD-MM-YYYY'),
    };

    this.visitorService.upsertVisitor(formattedVisitor).subscribe(() => {
      this.router.navigate(['/visitors']);
    });
  }
}
