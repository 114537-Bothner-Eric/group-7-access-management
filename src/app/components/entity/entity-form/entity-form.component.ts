import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {LoginService} from "../../../services/login.service";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-entity-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './entity-form.component.html',
  styleUrl: './entity-form.component.css'
})
export class EntityFormComponent implements OnInit{
  entityForm: FormGroup = {} as FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private  loginService : LoginService, private router : Router) {}

  ngOnInit(): void {
    this.entityForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      doc_type: ['DNI', Validators.required],
      doc_number: [null, Validators.required],
      birth_date: [null, Validators.required],
      comments: [''] // Comentarios adicionales
    });
  }

  onSubmit() {
    if (this.entityForm.valid) {
      const formData = this.entityForm.value;

      this.authService.createAccess(formData, this.loginService.getLogin().id.toString()).subscribe(data => {
        Swal.fire('Registro exitoso...', "Se registró correctamente", 'success');
      });
    }
  }

  onCancel() {
    this.router.navigate(['/auth/list']);
  }
}
