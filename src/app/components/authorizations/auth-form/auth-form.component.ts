import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { DaysOfWeek } from '../../../models/authorizeRequest.model';
import { AuthService } from '../../../services/auth.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { LoginService } from '../../../services/login.service';
import Swal from 'sweetalert2';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserTypeService } from '../../../services/userType.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RangeModalComponent } from '../range-modal/range-modal.component';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass, NgSelectModule],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.css',
})
export class AuthFormComponent implements OnInit {
  authForm: FormGroup = {} as FormGroup;
  plots: plot[] = [];
  plot: any = null;
  isUpdate = false;
  paramRoutes = inject(ActivatedRoute);
  modalService = inject(NgbModal);
  userType: string = 'ADMIN';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loginService: LoginService,
    private router: Router,
    private userTypeService: UserTypeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.authForm = this.createForm();
    this.initPlots();

    this.userType = this.userTypeService.getType();
    if (this.userType != 'ADMIN') {
      this.authForm.get('visitor_type')?.disable();
    }
    this.userTypeService.userType$.subscribe((userType: string) => {
      this.userType = userType;
      if (this.userType != 'ADMIN') {
        this.authForm.get('visitor_type')?.setValue('VISITOR');
        this.authForm.get('visitor_type')?.disable();
      } else {
        this.authForm.get('visitor_type')?.enable();
      }
    });

    const documentParam =
      this.paramRoutes.snapshot.queryParamMap.get('doc_number');
    if (documentParam) {
      this.isUpdate = true;
      this.authService
        .getByDocument(parseInt(documentParam, 10))
        .subscribe((datas) => {
          let data = datas[0];
          // Completa el formulario
          this.authForm.patchValue({
            visitor_type: data.visitor_type,
            plot_id: data.plot_id,
            visitor_request: {
              name: data.visitor.name,
              last_name: data.visitor.last_name,
              doc_type: data.visitor.doc_type,
              doc_number: data.visitor.doc_number,
              birth_date: this.formatDate(data.visitor.birth_date), // Asegúrate de formatear la fecha si es necesario
            },
          });

          // Completar auth_range_request
          const authRanges = data.auth_ranges.map((range) => ({
            auth_range_id: range.auth_range_id,
            date_from: this.formatDate(range.date_from),
            date_to: this.formatDate(range.date_to),
            hour_from: range.hour_from,
            hour_to: range.hour_to,
            days_of_week: range.days_of_week,
            comment: range.comment,
            is_active: range.is_active,
          }));

          this.authForm.patchValue({ auth_range_request: authRanges });
        });
    }
  }

  formatDate(dateString: string) {
    const parts = dateString.split('-'); // Divide la cadena en partes
    // Asegúrate de que el formato sea correcto (DD-MM-YYYY)
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`; // Retorna YYYY-MM-DD
    }
    return dateString;
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
      auth_range_request: [[]],
    });
  }

  onSubmit() {
    console.log(this.authForm.value);
    return;
    if (this.authForm.valid) {
      const formData = this.authForm.value;
      formData.visitor_request.birth_date = formatFormDate(
        formData.visitor_request.birth_date
      );

      const now = new Date();

      const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };

      const formatTime = (date: Date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = '00';
        return `${hours}:${minutes}:${seconds}`;
      };

      const dateFrom = formatDate(now);
      const dateTo = new Date(now.getTime() + 15 * 60000);
      const isNewDay = dateTo.getDate() !== now.getDate();
      const finalDateFrom = isNewDay
        ? formatDate(
            new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0)
          )
        : dateFrom;

      if (formData.auth_range_request.length === 0) {
        const authRange = {
          date_from: finalDateFrom,
          date_to: formatDate(dateTo),
          hour_from: isNewDay ? '00:00:00' : formatTime(now),
          hour_to: formatTime(dateTo),
          days_of_week: [this.getDayOfWeek(now)],
          comment: 'Access for John Doe',
        };

        formData.auth_range_request = [authRange];
      }

      if (!this.isUpdate) {
        this.authService
          .createAuth(formData, this.loginService.getLogin().id.toString())
          .subscribe((data) => {
            Swal.fire({
              title: 'Registro exitoso!',
              text: 'Proceda a registrar el acceso',
              icon: 'success',
              showCancelButton: true,
              confirmButtonText: 'Cerrar',
              cancelButtonText: 'Ir a nuevo acceso',
              customClass: {
                confirmButton: 'btn btn-danger',
                cancelButton: 'btn btn-primary',
              },
            }).then((result) => {
              if (result.isDismissed) {
                this.router.navigate(['/access/form']);
              }
            });
          });
      } else {
        this.authService
          .updateAuth(formData, this.loginService.getLogin().id.toString())
          .subscribe((data) => {
            Swal.fire({
              title: 'Actualización exitosa!',
              text: '',
              icon: 'success',
              showCancelButton: true,
              confirmButtonText: 'Cerrar',
              cancelButtonText: 'Ir a autorizaciones',
              customClass: {
                confirmButton: 'btn btn-danger',
                cancelButton: 'btn btn-primary',
              },
            }).then((result) => {
              if (result.isDismissed) {
                this.router.navigate(['/auth/list']);
              }
            });
          });
      }
    } else {
      this.markAllAsTouched();
    }
  }

  getDayOfWeek(date: Date): string {
    const days = [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
    ];
    return days[date.getDay()];
  }

  openModal() {
    const modalRef = this.modalService.open(RangeModalComponent, {
      size: 'xl',
    });
    modalRef.componentInstance.ranges =
      this.authForm.get('auth_range_request')?.value;
    modalRef.result
      .then((result) => {
        this.authForm.get('auth_range_request')?.setValue(result);
      })
      .catch((error) => {
        console.error('Modal cerrado sin guardar cambios', error);
      });
  }

  onCancel() {
    this.router.navigate(['/auth/list']);
  }

  initPlots() {
    this.plots = [
      {
        id: 1,
        desc: 'Andrés Torres',
        tel: '555-1234',
        name: '1 - Andrés Torres',
      },
      { id: 2, desc: 'Ana María', tel: '555-5678', name: '2 - Ana María' },
      {
        id: 3,
        desc: 'Carlos Pérez',
        tel: '555-2345',
        name: '3 - Carlos Pérez',
      },
      {
        id: 4,
        desc: 'Luisa Fernández',
        tel: '555-6789',
        name: '4 - Luisa Fernández',
      },
      {
        id: 5,
        desc: 'Miguel Ángel',
        tel: '555-3456',
        name: '5 - Miguel Ángel',
      },
      {
        id: 6,
        desc: 'Sofía Martínez',
        tel: '555-7890',
        name: '6 - Sofía Martínez',
      },
      { id: 7, desc: 'David Gómez', tel: '555-4567', name: '7 - David Gómez' },
      {
        id: 8,
        desc: 'Isabel García',
        tel: '555-8901',
        name: '8 - Isabel García',
      },
      {
        id: 9,
        desc: 'Fernando López',
        tel: '555-5679',
        name: '9 - Fernando López',
      },
      { id: 10, desc: 'María José', tel: '555-6780', name: '10 - María José' },
    ];
  }

  private markAllAsTouched(): void {
    // Marca todos los controles en el formulario principal
    Object.values(this.authForm.controls).forEach((control) => {
      control.markAsTouched();
      // Si es un FormGroup, recorre sus controles
      if (control instanceof FormGroup) {
        this.markAllAsTouchedRecursive(control);
      }
      // Si es un FormArray, recorre sus controles
      if (control instanceof FormArray) {
        control.controls.forEach((innerControl) => {
          innerControl.markAsTouched();
        });
      }
    });
  }

  setPlot(id: number) {
    this.plot = this.plots.filter((x) => x.id == id)[0];
  }

  // Función recursiva para marcar todos los controles como tocados
  private markAllAsTouchedRecursive(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markAllAsTouchedRecursive(control); // Llamada recursiva
      }
      if (control instanceof FormArray) {
        control.controls.forEach((innerControl) => {
          innerControl.markAsTouched();
        });
      }
    });
  }
  onPlotSelected(selectedPlot: plot) {
    this.plot = this.plots.find((plot) => plot.id === selectedPlot.id) || null;
    console.log(this.plot)
  }
}

function formatFormDate(inputDate: string): string {
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

export interface plot {
  id: number;
  desc: string;
  tel: string;
  name: string;
}
