import {Component, OnInit,} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule, FormArray} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {DaysOfWeek} from '../../../models/authorizeRequest.model'
import {AuthService} from "../../../services/auth.service";
import {LoginService} from "../../../services/login.service";
import Swal from 'sweetalert2';
import {NgIf} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.css'
})
export class AuthFormComponent implements OnInit {
  authForm: FormGroup = {} as FormGroup;
  plots: any[] = []

  constructor(private fb: FormBuilder, private authService: AuthService, private loginService: LoginService, private router: Router) {
  }

  ngOnInit(): void {
    this.authForm = this.createForm();
    this.authForm.get('visitor_type')?.disable()
    this.initPlots()
  }

  get authRangeRequests(): FormArray {
    return this.authForm.get('auth_range_request') as FormArray;
  }

  addAuthRange(): void {
    this.authRangeRequests.push(this.createAuthRange());
  }

  removeAuthRange(index: number): void {
    this.authRangeRequests.removeAt(index);
  }

  createForm(): FormGroup {
    return this.fb.group({
      visitor_type: ['VISITOR', Validators.required],
      plot_id: [null, Validators.required],
      visitor_request: this.fb.group({
        name: ['', Validators.required],
        last_name: ['', Validators.required],
        doc_type: ['DNI', Validators.required],
        doc_number: [null, Validators.required],
        birth_date: [null, Validators.required],
      }),
      auth_range_request: this.fb.array([])
    });
  }

  createAuthRange(): FormGroup {
    return this.fb.group({
      date_from: [null, Validators.required],
      date_to: [null, Validators.required],
      hour_from: ['00:00', Validators.required],
      hour_to: ['23:59', Validators.required],
      days_of_week: [[], Validators.required],
      comment: ['']
    });
  }

  onSubmit() {
    if (this.authForm.valid) {
      const formData = this.authForm.value;

      formData.visitor_request.birth_date = formatDate(formData.visitor_request.birth_date);

      formData.auth_range_request.forEach((range: any) => {
        range.date_from = formatDate(range.date_from);
        range.date_to = formatDate(range.date_to);
        range.hour_from += ':00';
        range.hour_to += ':00';
      });


      this.authService.createAuth(formData, this.loginService.getLogin().id.toString()).subscribe(data => {
        Swal.fire('Registro exitoso...', "this.titularAlerta", 'success');
      });
    }
  }

  onCancel() {
    this.router.navigate(['/auth/list']);
  }

  initPlots() {
    this.plots = [
      { id: 1, desc: "Andrés Torres" },
      { id: 2, desc: "Ana María" },
      { id: 3, desc: "Carlos Pérez" },
      { id: 4, desc: "Luisa Fernández" },
      { id: 5, desc: "Miguel Ángel" },
      { id: 6, desc: "Sofía Martínez" },
      { id: 7, desc: "David Gómez" },
      { id: 8, desc: "Isabel García" },
      { id: 9, desc: "Fernando López" },
      { id: 10, desc: "María José" }
    ]
  }

}

function formatDate(inputDate: string): string {
  // Verificar que la entrada sea una fecha válida en el formato yyyy-MM-dd
  const dateParts = inputDate.split('-');
  if (dateParts.length !== 3) {
    throw new Error('Fecha no válida. Debe estar en formato yyyy-MM-dd');
  }

  const year = dateParts[0];
  const month = dateParts[1];
  const day = dateParts[2];

  // Devolver la fecha en el formato dd-MM-yyyy
  return `${day}-${month}-${year}`;
}
