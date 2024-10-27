import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {LoginService} from "../../../services/login.service";
import {ActivatedRoute, Route, Router} from "@angular/router";
import Swal from "sweetalert2";
import {NgIf} from "@angular/common";
import moment from "moment";
import {SendVisitor} from "../../../old/visitor/models/visitor.model";
import {VisitorService} from "../../../services/visitor.service";

@Component({
  selector: 'app-entity-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    FormsModule
  ],
  templateUrl: './entity-form.component.html',
  styleUrl: './entity-form.component.css'
})
export class EntityFormComponent implements OnInit {
  entityForm: FormGroup = {} as FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private loginService: LoginService, private router: Router, private visitorService: VisitorService, private route: ActivatedRoute) {
  }

  /*

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
  */

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


  visitor: SendVisitor = {
    owner_id: 0,
    name: '',
    last_name: '',
    doc_number: '',
    birth_date: new Date(),
    is_active: true,
  };


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
   /* if (id) {
      this.visitorService.getVisitor(+id).subscribe((response: SendVisitor) => {
        this.visitor = {
          owner_id: response.owner_id,
          name: response.name,
          last_name: response.last_name,
          doc_number: response.doc_number,
          is_active: response.is_active,
          birth_date: moment(response.birth_date, 'DD-MM-YYYY').toDate(),
        };
      });
    }*/
  }

  saveVisitor(): void {
    const formattedVisitor = {
      ...this.visitor,
      birth_date: moment(this.visitor.birth_date).format('DD-MM-YYYY'),
    };

    console.log(formattedVisitor);
    this.visitorService.upsertVisitor(formattedVisitor).subscribe(() => {
      this.router.navigate(['/qr'], {
        queryParams: {
          docNumber: this.visitor.doc_number,
          fromVisitorForm: true,
        },
      });
    });
  }
}
