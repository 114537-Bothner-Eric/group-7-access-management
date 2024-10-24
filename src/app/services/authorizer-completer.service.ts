import { Injectable } from '@angular/core';
import {Authorizer} from "../models/authorize.model";

@Injectable({
  providedIn: 'root'
})
export class AuthorizerCompleterService {

  constructor() {
  }

  authorizers: Authorizer[] = [
    {
      id: 1,
      name: 'Lucas',
      last_name: 'Angel',
      doc_type: 'DNI',
      doc_number: 2457
    },
    {
      id: 2,
      name: 'Cosme',
      last_name: 'Fulanito',
      doc_type: 'DNI',
      doc_number: 4682
    }

  ]

  completeAuthorizer(id: number): Authorizer {
    return this.authorizers.find(x => x.id == id)!;
  }
}
