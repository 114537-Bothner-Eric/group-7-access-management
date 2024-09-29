export interface Visitor {
  visitorId: number;
  ownerId: number;
  name: string;
  lastName: string;
  docNumber: string;
  birthDate: any;
  active: boolean;
}

export interface SendVisitor {
  name: string;
  ownerId: number;
  lastName: string;
  docNumber: string;
  birthDate: any;
  active: boolean;
}
