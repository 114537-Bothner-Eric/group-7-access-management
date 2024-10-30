import {AfterViewInit, Component, ElementRef, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {
    CadastrePlotFilterButtonsComponent
} from "../../accesses/cadastre-access-filter-buttons/cadastre-plot-filter-buttons.component";
import {MainContainerComponent, TableColumn, TableComponent, ToastService} from "ngx-dabd-grupo01";
import {NgbModal, NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AccessActionDictionary, AccessFilters, AccessModel} from "../../../models/access.model";
import {Router} from "@angular/router";
import {AccessService} from "../../../services/access.service";
import {TransformResponseService} from "../../../services/transform-response.service";
import {AuthorizerCompleterService} from "../../../services/authorizer-completer.service";
import {VisitorTypeAccessDictionary} from "../../../models/authorize.model";
import {Visitor} from "../../../models/visitor.model";
import {filterVisitor, VisitorService} from "../../../services/visitor.service";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-entity-list',
  standalone: true,
  imports: [
    CadastrePlotFilterButtonsComponent,
    MainContainerComponent,
    NgbPagination,
    ReactiveFormsModule,
    FormsModule,
    TableComponent
  ],
  templateUrl: './entity-list.component.html',
  styleUrl: './entity-list.component.css'
})
export class EntityListComponent  implements OnInit, AfterViewInit {

  /*@ViewChild('filterComponent') filterComponent!: CadastrePlotFilterButtonsComponent<Visitor>;
  @ViewChild('table', {static: true}) tableName!: ElementRef<HTMLTableElement>;
  @ViewChild('infoModal') infoModal!: TemplateRef<any>;

  //#region SERVICIOS
  private router = inject(Router)
  private visitorService = inject(VisitorService)
  private transformResponseService = inject(TransformResponseService)
  private authorizerCompleterService = inject(AuthorizerCompleterService)
  private toastService = inject(ToastService)
  private modalService = inject(NgbModal)
  //#endregion

  //#region ATT de PAGINADO
  currentPage: number = 0
  pageSize: number = 10
  sizeOptions: number[] = [10, 25, 50]
  list: Visitor[] = [];
  completeList: [] = [];
  filteredList: Visitor[] = [];
  lastPage: boolean | undefined
  totalItems: number = 0;
  //#endregion
  heads: string[] =["Nombre","Documento","Tipos"]
  props: string[] =["Nombre","Documento","Tipos"]

  //#region ATT de ACTIVE
  retrieveByActive: boolean | undefined = true;
  //#endregion

  //#region ATT de FILTROS
  applyFilterWithNumber: boolean = false;
  applyFilterWithCombo: boolean = false;
  contentForFilterCombo: string[] = []
  actualFilter: string | undefined = AccessFilters.NOTHING;
  filterTypes = AccessFilters;
  filterInput: string = "";
  //#endregion

  //#region ATT de DICCIONARIOS
  typeDictionary = VisitorTypeAccessDictionary;
  actionDictionary = AccessActionDictionary;
  dictionaries = [this.typeDictionary, this.actionDictionary]
  //#endregion

  //#region NgOnInit | BUSCAR
  ngOnInit() {
    this.confirmFilter();
  }

  ngAfterViewInit(): void {
   this.filterComponent.filter$.subscribe((filter: string) => {
     this.getAllFiltered(filter)
    });
  }

  //#endregion

  //#region GET_ALL
  getAll() {
    this.visitorService.getAll(this.currentPage, this.pageSize, this.retrieveByActive).subscribe(data => {

        this.completeList = this.transformListToTableData(data.items);
        console.log(this.completeList)
        let response = this.transformResponseService.transformResponse(data.items,this.currentPage, this.pageSize, this.retrieveByActive)


        this.list = response.content;
        this.filteredList = [...this.list]
        this.lastPage = response.last
        this.totalItems = response.totalElements;
      },
      error => {
        console.error('Error getting:', error);
      }
    );
  }

  getAllFiltered(filter:string) {
    this.visitorService.getAll(this.currentPage, this.pageSize, this.retrieveByActive).subscribe(data => {
        data.items = data.items.filter(x => (x.name.toLowerCase().includes(filter) || x.last_name.toLowerCase().includes(filter) || x.doc_number.toString().includes(filter)))
        let response = this.transformResponseService.transformResponse(data.items,this.currentPage, this.pageSize, this.retrieveByActive)
        response.content.forEach(data => {
          data.authorizer = this.authorizerCompleterService.completeAuthorizer(data.authorizer_id)
        })

        this.list = response.content;
        this.filteredList = [...this.list]
        this.lastPage = response.last
        this.totalItems = response.totalElements;
      },
      error => {
        console.error('Error getting:', error);
      }
    );
  }

  //#endregion

  //#region FILTROS
  filterByVisitorType(type: string) {
   this.visitorService.getAll(this.currentPage, this.pageSize, this.retrieveByActive).subscribe(data => {
       data.items = data.items.filter(x => (x.visitor_types.includes(type)))
        let response = this.transformResponseService.transformResponse(data.items,this.currentPage, this.pageSize, this.retrieveByActive)
        response.content.forEach(data => {
          data.authorizer = this.authorizerCompleterService.completeAuthorizer(data.authorizer_id)
        })

        this.list = response.content;
        this.filteredList = [...this.list]
        this.lastPage = response.last
        this.totalItems = response.totalElements;
      },
      error => {
        console.error('Error getting:', error);
      }
    );
  }

  filterByAction(action: string) {
    /*this.visitorService.getByAction(this.currentPage, this.pageSize, action, this.retrieveByActive).subscribe(data => {
        let response = this.transformResponseService.transformAction(data,this.currentPage, this.pageSize, action, this.retrieveByActive)
        response.content.forEach(data => {
          data.authorizer = this.authorizerCompleterService.completeAuthorizer(data.authorizer_id)
        })

        this.list = response.content;
        this.filteredList = [...this.list]
        this.lastPage = response.last
        this.totalItems = response.totalElements;
      },
      error => {
        console.error('Error getting:', error);
      }
    );*/
  //}

  //#endregion

  //#region APLICACION DE FILTROS
 /* changeActiveFilter(isActive?: boolean) {
    this.retrieveByActive = isActive
    this.confirmFilter();
  }


  changeFilterMode(mode: AccessFilters) {
    switch (mode) {
      case AccessFilters.NOTHING:
        this.actualFilter = AccessFilters.NOTHING
        this.applyFilterWithNumber = false;
        this.applyFilterWithCombo = false;
        this.filterComponent.clearFilter();
        this.confirmFilter();
        break;

      case AccessFilters.ACTION:
        this.actualFilter = AccessFilters.ACTION
        this.contentForFilterCombo = this.getKeys(this.actionDictionary)
        this.applyFilterWithNumber = false;
        this.applyFilterWithCombo = true;
        break;

      case AccessFilters.VISITOR_TYPE:
        this.actualFilter = AccessFilters.VISITOR_TYPE
        this.contentForFilterCombo = this.getKeys(this.typeDictionary)
        this.applyFilterWithNumber = false;
        this.applyFilterWithCombo = true;
        break;

      default:
        break;
    }
  }

  confirmFilter() {
    switch (this.actualFilter) {
      case "NOTHING":
        this.getAll()
        break;

      case "ACTION":
        this.filterByAction(this.translateCombo(this.filterInput, this.actionDictionary));
        break;

      case "VISITOR_TYPE":
        this.filterByVisitorType(this.translateCombo(this.filterInput, this.typeDictionary));
        break;

      default:
        break;
    }
  }

  //#endregion

  //#region DELETE
  /*  assignPlotToDelete(plot: Plot) {
      //TODO: Este modal se va a modificar por otro mas especifico de Eliminar.
      const modalRef = this.modalService.open(ConfirmAlertComponent)
      modalRef.componentInstance.alertTitle = 'Confirmacion';
      modalRef.componentInstance.alertMessage = `Estas seguro que desea eliminar el lote nro ${plot.plotNumber} de la manzana ${plot.blockNumber}?`;

      modalRef.result.then((result) => {
        if (result) {

          this.plotService.deletePlot(plot.id, 1).subscribe(
            response => {
              this.toastService.sendSuccess('Lote eliminado correctamente.')
              this.confirmFilter();
            }, error => {
              this.toastService.sendError('Error al eliminar lote.')
            }
          );
        }
      })
    }*/

  //#endregion

  //#region RUTEO
 /* plotOwners(plotId: number) {
    this.router.navigate(["/owners/plot/" + plotId])
  }

  updatePlot(plotId: number) {
    this.router.navigate(["/plot/form/", plotId])
  }

  plotDetail(plotId: number) {
    this.router.navigate([`/plot/detail/${plotId}`])
  }

  //#endregion

  //#region USO DE DICCIONARIOS
  getKeys(dictionary: any) {
    return Object.keys(dictionary);
  }

  translateCombo(value: any, dictionary: any) {
    if (value !== undefined && value !== null) {
      return dictionary[value];
    }
    console.log("Algo salio mal.")
    return;
  }

  translateTable(value: any, dictionary: { [key: string]: any }) {
    if (value !== undefined && value !== null) {
      for (const key in dictionary) {
        if (dictionary[key] === value) {
          return key;
        }
      }
    }
    console.log("Algo salio mal.");
    return;
  }

  //#endregion

  //#region REACTIVAR
  /*  reactivatePlot(plotId: number) {
      this.plotService.reactivatePlot(plotId, 1).subscribe(
        response => {
          location.reload();
        }
      );
    }*/

  //#endregion

  //#region FUNCIONES PARA PAGINADO
 /* onItemsPerPageChange() {
    this.confirmFilter();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.confirmFilter();
  }

  //#endregion

  //#region SHOW INFO | TODO
  showInfo() {
    // TODO: En un futuro agregar un modal que mostrara informacion de cada componente
  }

  //#endregion


  editVisitor(id:number){

  }
  deleteVisitor(id:number){

  }
  transformListToTableData(list: any) {
    return list.map((item: {
      name: any;
      last_name: any;
      doc_type: any;
      doc_number: any;
      visitor_types: any[]; // Suponiendo que visitor_types es un array
    }) => ({
      Nombre: `${item.name} ${item.last_name}`,
      Documento: `${item.doc_type === "PASSPORT" ? "PASAPORTE" : item.doc_type} ${item.doc_number}`,
      Tipos: item.visitor_types?.map(type => this.translateTable(type, this.typeDictionary)).join(', '), // Traducir cada tipo y unirlos en una cadena
    }));
  }*/
    private visitorService = inject(VisitorService);
    private router = inject(Router);
    private modalService = inject(NgbModal);

    visitors: Visitor[] = [];
  filteredVisitors: Visitor[] = [];
  isLoading = true;
  // Filtros por el buscador
  searchFilter: string = ''; 

    // Filtros
    applyFilterWithNumber: boolean = false;
    applyFilterWithCombo: boolean = false;
    contentForFilterCombo: string[] =[];
    filterTypes = filterVisitor ;
    actualFilter: string | undefined = filterVisitor.NOTHING;
    filterInput: string = "";


  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>; // Accedemos al ng-template
  @ViewChild('table') tableComponent!: TableComponent;
  @ViewChild('tableElement') tableElement!: ElementRef;
  @ViewChild('infoModal') infoModal!: TemplateRef<any>;

  @ViewChild('nameTemplate') nameColumn!: TemplateRef<any>;
  @ViewChild('documentTemplate') documentColumn!: TemplateRef<any>;

  columns: TableColumn[] = [];
  
  ngAfterViewInit(): void {
    setTimeout(() => {
      // Configuramos las columnas, incluyendo la de acciones
      this.columns = [
        { headerName: 'Nombre', accessorKey: 'name' , cellRenderer: this.nameColumn},
        { headerName: 'Documento', accessorKey: 'doc_type' , cellRenderer: this.documentColumn},
        { headerName: 'Tipo', accessorKey: 'visitor_types' },
      ];
    });
  }

  page: number = 1;
  size: number = 10;
  totalItems: number = 0;


  ngOnInit(): void {
    this.loadVisitors();
  }

  loadVisitors(filter?: string): void {
    this.isLoading = true;
    this.visitorService.getAll(this.page -1, this.size ,filter ,true).subscribe({
    next: (data) => {
      console.log(data)

      this.visitors = data.items.map(visitor => {
        if (visitor.doc_type === 'PASSPORT') {
          visitor.doc_type = 'PASS';
        }
        return visitor;
      });

      this.filteredVisitors = this.visitors;
      this.totalItems = data.total_elements;
      this.isLoading = false;
    },
    error : (error) => {
      console.log(error);
    }
    });
  }

  onPageChange = (page: number): void => {
    this.page = page;
    this.loadVisitors();
  };

  onPageSizeChange = (size: number): void => {
    this.size = size;
    this.loadVisitors();
  };

 onFilterChange = (filter: string): void => {
    console.log(filter);
    
    if(filter === '') {
      this.loadVisitors();
    }else{
      this.loadVisitors(filter);
    }
  };

  
    getActualDayFormat() {
      const today = new Date();
      const formattedDate = today.getDate() + '-' +(today.getMonth() + 1 )+ '-' + today.getFullYear();
      return formattedDate;
    }
  
  async onPdfButtonClick() {
    console.log('Generando PDF...');
    
    const doc = new jsPDF();

    // Título del PDF
    doc.setFontSize(18);
    doc.text('Listado de visitantes', 14, 20);

    // Llamada al servicio para obtener todos los visitantes
    this.visitorService.getAll(0, this.totalItems) 
      .subscribe(visitors => {
        if (visitors.items.length === 0) {
          console.warn('No hay visitantes para exportar.');
          doc.text('No hay visitantes para exportar.', 14, 30);
          doc.save(this.getActualDayFormat() + '_visitantes.pdf');
          return;
        }

        // Usamos autoTable para agregar la tabla con los datos de los visitantes
        autoTable(doc, {
          startY: 30,
          head: [['Tipo de documento', 'Número de documento', 'Nombre', 'Apellido']],
          body: visitors.items.map(visitor => [
            visitor.doc_type === 'PASSPORT' ? 'PASAPORTE' : visitor.doc_type, // Ajustamos el tipo de documento
            visitor.doc_number,
            visitor.name,
            visitor.last_name,
          ]),
        });

        // Guardamos el PDF
        doc.save(this.getActualDayFormat() + '_visitantes.pdf');
        console.log('PDF generado y guardado con éxito.');
      });
  }

  onExcelButtonClick() {
    const worksheet = XLSX.utils.json_to_sheet(this.visitors);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Visitors');
    
    // Exporta el archivo Excel
    XLSX.writeFile(workbook, 'Visitors.xlsx');
 }
 

  filterVisitorsByDocumentType(docType: string): void {
      // Verifica si el tipo de documento está vacío
      debugger;
      if (docType) {
        if(docType === 'PASAPORTE') {
          docType = 'PASS';
        }
        this.filteredVisitors = this.visitors.filter(visitor => visitor.doc_type === docType);
      } else {
        
        this.filteredVisitors = [];
      }
    }

    changeFilterMode(mode: filterVisitor) {
      switch (mode) {
        case filterVisitor.NOTHING:
          this.actualFilter = filterVisitor.NOTHING
          this.applyFilterWithNumber = false;
          this.applyFilterWithCombo = false;
          this.confirmFilter();
          break;
    
        case filterVisitor.DOCUMENT_NUMBER:
          this.actualFilter = filterVisitor.DOCUMENT_NUMBER
          this.applyFilterWithNumber = true;
          this.applyFilterWithCombo = false;
      
          break;
        case filterVisitor.DOCUMENT_TYPE:
          this.actualFilter = filterVisitor.DOCUMENT_TYPE;
          this.contentForFilterCombo = ['DNI', 'PASAPORTE', 'CUIL', 'CUIT'];
          this.applyFilterWithNumber = false;
          this.applyFilterWithCombo = true;
          break;
    
        default:
          break;
         
      }
    }

    confirmFilter() {
      switch (this.actualFilter) {
        case "NOTHING":
          this.loadVisitors();
          break;
    
        case "DOCUMENT_NUMBER":
          this.loadVisitors(this.filterInput);
          break;
    
        case "DOCUMENT_TYPE":
          this.filterVisitorsByDocumentType(this.filterInput);
          break;
    
        default:
          break;
      }
    }

  onInfoButtonClick() {
    this.modalService.open(this.infoModal, {centered: true, size: 'lg'});
    }
}
