import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Auth} from "../../../models/authorize.model";
import {Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {LoginService} from "../../../services/login.service";
import {ExcelService} from "../../../services/excel.service";

@Component({
  selector: 'app-auth-list',
  standalone: true,
  imports: [],
  templateUrl: './auth-list.component.html',
  styleUrl: './auth-list.component.css'
})
export class AuthListComponent implements OnInit {
  list: Auth[] = [];
  filteredList: Auth[] = [];
  page: Auth[] = [];
  showButtons: boolean = true;
  tableName: string = "autorizaciones";

  constructor(private fb: FormBuilder, private authService: AuthService, private loginService: LoginService, private router: Router, private excelService:ExcelService) {
  }

  currentPage: number = 0
  pageSize: number = 2
  lastPage: boolean = true

  ngOnInit(): void {
    this.getAll();
    // this.ownerService.getData();

  }

  getAll() {
    this.authService.getAll().subscribe(data => {
        this.filteredList = data;
        this.page = this.filteredList.slice(0, this.pageSize)
        this.list = data
        this.list.length > this.pageSize ? this.lastPage = false : this.lastPage = true;
        console.log(this.list.length)

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

  prepareExport(): any{
   this.showButtons = false
    let oldPage = this.page
   this.page = this.filteredList
    return oldPage
  }
  revertExport(oldpage : any ){
    this.showButtons = true
    this.page = oldpage
  }

  detailOwner(id: number) {
    this.router.navigate(['/owner/detail/', id]);
  }


  detail(id: number) {

  }

  edit(id: number) {

  }

  delete(id: number) {

  }


}
