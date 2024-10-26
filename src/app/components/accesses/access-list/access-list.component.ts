import { Component } from '@angular/core';
import {NgIf} from "@angular/common";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {Auth} from "../../../models/authorize.model";
import {AuthService} from "../../../services/auth.service";
import {LoginService} from "../../../services/login.service";
import {Router} from "@angular/router";
import {ExcelService} from "../../../services/excel.service";
import {AccessModel} from "../../../models/access.model";
import {AccessService} from "../../../services/access.service";
import {AuthorizerCompleterService} from "../../../services/authorizer-completer.service";
import {
  CadastrePlotFilterButtonsComponent
} from "../cadastre-plot-filter-buttons/cadastre-plot-filter-buttons.component";

@Component({
  selector: 'app-access-list',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    CadastrePlotFilterButtonsComponent
  ],
  templateUrl: './access-list.component.html',
  styleUrl: './access-list.component.css'
})
export class AccessListComponent {
  list: AccessModel[] = [];
  filteredList: AccessModel[] = [];
  page: AccessModel[] = [];
  tableName: string = "accesos";

  constructor(private accessService: AccessService, private router: Router, private excelService:ExcelService, private authorizerCompleterService: AuthorizerCompleterService) {
  }

  currentPage: number = 0
  pageSize: number = 20
  lastPage: boolean = true

  ngOnInit(): void {
    this.getAll();
    // this.ownerService.getData();

  }

  getAll() {
    this.accessService.getAll().subscribe(data => {
      data.forEach(data => {
        data.authorizer = this.authorizerCompleterService.completeAuthorizer(data.authorizer_id)
      })

        this.filteredList = data;
        this.page = this.filteredList.slice(0, this.pageSize)
        this.list = data
        this.list.length > this.pageSize ? this.lastPage = false : this.lastPage = true;
      }
    );
  }

  onFilterTextBoxChanged(event: any){

  }

  changePage(forward: boolean) {
    forward ? this.currentPage++ : this.currentPage--;

    let leftLimit : number = this.currentPage * this.pageSize
    let rightLimit : number = leftLimit + this.pageSize

    this.page = this.filteredList.slice(leftLimit, rightLimit)
    this.list.length <= rightLimit ? this.lastPage = true : this.lastPage = false;
  }

  exportToExcel(){
    this.excelService.exportTableToExcel(document.getElementById(this.tableName) as HTMLTableElement, this.tableName);
  }


}
