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
