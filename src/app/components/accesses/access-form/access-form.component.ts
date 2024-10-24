import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-access-form',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './access-form.component.html',
  styleUrl: './access-form.component.css'
})
export class AccessFormComponent {
  authForm: FormGroup = {} as FormGroup;
  daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.authForm = this.fb.group({
      visitor_type: ['VISITOR', Validators.required],
      plot_id: [null, Validators.required],
      visitor_request: this.fb.group({
        name: ['', Validators.required],
        last_name: ['', Validators.required],
        doc_type: ['DNI', Validators.required],
        doc_number: [null, Validators.required],
        birth_date: [null, Validators.required],
      }),
      auth_range_request: this.fb.group({
        date_from: [null, Validators.required],
        date_to: [null, Validators.required],
        hour_from: ['00:00', Validators.required],
        hour_to: ['23:59', Validators.required],
        days_of_week: [[], Validators.required],
        comment: ['']
      })
    });
  }

  onSubmit() {
    if (this.authForm.valid) {
      console.log(this.authForm.value);
      // Lógica para enviar el formulario
    }
  }

  onCancel() {
    // Lógica para cancelar el formulario
  }
}
