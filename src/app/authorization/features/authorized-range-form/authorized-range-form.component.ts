import { Component } from '@angular/core';
import { AuthorizedRange } from '../../models/authorized-range.model';
import { AuthorizedRangeService } from '../../services/authorized-range.service';
import { Router } from '@angular/router';
import moment from 'moment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-authorized-range-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './authorized-range-form.component.html',
})
export class AuthorizedRangeFormComponent {
  authorizedRange: AuthorizedRange = {
    auth_type_id: 0,
    visitor_id: 0,
    external_id: 0,
    date_from: '',
    date_to: '',
    hour_from: '',
    hour_to: '',
    day_of_weeks: [],
    plot_id: 0,
    comment: '',
  };

  daysOfWeek = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
  ];

  constructor(
    private authorizedRangeService: AuthorizedRangeService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.authorizedRange.date_from = moment(
      this.authorizedRange.date_from
    ).format('YYYY-MM-DD');
    this.authorizedRange.date_to = moment(this.authorizedRange.date_to).format(
      'YYYY-MM-DD'
    );

    this.authorizedRangeService
      .registerAuthorizedRange(this.authorizedRange)
      .subscribe(() => {
        this.router.navigate(['/success']);
      });
  }
}
