// Define la interfaz para AuthRange
import {DaysOfWeek} from "./authorizeRequest.model";

export interface AuthRange {
  auth_range_id: number;
  date_from: string; // Considera usar Date si prefieres
  date_to: string;   // Considera usar Date si prefieres
  hour_from: string; // Formato HH:mm:ss
  hour_to: string;   // Formato HH:mm:ss
  days_of_week: DaysOfWeek[];
  comment: string;
  is_active: boolean;
}

// Define la interfaz para Visitor
export interface Visitor {
  visitor_id: number;
  name: string;
  last_name: string | null;
  doc_type: string; // Tipo de documento (DNI, etc.)
  doc_number: number; // Número de documento
  birth_date: string; // Formato de fecha 'DD-MM-YYYY'
  is_active: boolean;
}

// Define la interfaz para tu modelo principal
export interface Auth {
  auth_id: number;
  plot_id: number | null; // Puede ser null
  visitor: Visitor;
  visitor_type: "PROVIDER_ORGANIZATION" | "PROVIDER" | "VISITOR"; // Tipos posibles
  external_id: number | null; // Puede ser null
  auth_ranges: AuthRange[];
  is_active: boolean;
}
