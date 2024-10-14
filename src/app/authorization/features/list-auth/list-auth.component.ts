import { Component, inject, OnInit } from '@angular/core';
import { AuthRangeService } from '../../services/auth-range.service';
import { AuthDTO } from '../../models/authorized-range.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-auth',
  standalone: true,
  imports: [FormsModule , CommonModule],
  templateUrl: './list-auth.component.html',
  styleUrl: './list-auth.component.css'
})
export class ListAuthComponent implements OnInit{
  
  private serviceAuhtRange = inject(AuthRangeService);

  authRecords: AuthDTO[] = [];
  docNumber: number = 0; 

  constructor() {}
  ngOnInit(): void {
    this.getAuthRecords(); 
  }

  getAuthRecords(): void {
    this.serviceAuhtRange.getAuhtByDocNumber(this.docNumber).subscribe((data) => {
      console.log(data)
      this.authRecords = data;
    });
  }

  translateDays(daysString: string): string {
    const daysArray = daysString.split('-').map(day => day.trim());
    const translatedDays = daysArray.map(day => this.translateDay(day));
    return translatedDays.join(', ');
  }

  translateDay(day: string): string {

    switch (day) {
      case 'SUNDAY':
        return 'Domingo';
      case 'MONDAY':
        return 'Lunes';
      case 'TUESDAY':
        return 'Martes';
      case 'WEDNESDAY':
        return 'Miércoles';
      case 'THURSDAY':
        return 'Jueves';
      case 'FRIDAY':
        return 'Viernes';
      case 'SATURDAY':
        return 'Sábado';
      default:
        return day; // Devuelve el día original si no hay coincidencia
    }
  }

}
