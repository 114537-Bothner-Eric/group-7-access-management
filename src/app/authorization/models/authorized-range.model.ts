export interface AuthorizedRange {
  auth_type_id: number;  
  visitor_id: number;   
  external_id: number;  
  date_from: string;   
  date_to: string;      
  hour_from: string;    
  hour_to: string;      
  day_of_weeks: string[];
  plot_id: number;    
  comment: string;
}

//nuevo modelo
export interface VisitorDTO {
  name: string;
  last_name: string;
  doc_number:string;
}

export interface AuthRangeDTO {
  date_from:string;
  date_to:string;
  day_of_weeks:string;
  hour_from: string;
  hour_to: string;
  plot_id:string;
}

export interface AuthDTO {
  auth_id: number;
  visitor: VisitorDTO;
  visitor_type: string;
  auth_ranges: AuthRangeDTO[];
  is_active: boolean;
}
