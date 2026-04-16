export interface ReceiptInterface {
  id?: string;
  supplier_id?: string;
  supplier_name?: string;
  supplier_status?: boolean;
  license_plate?: string;
  arrival_date?: Date;
  scheduling_date?: Date;
  invoice_number?: string;
  invoice_weight?: number;
  scale_weight?: number;
  start_date?: Date;
  end_date?: Date;
  wait_time_min?: number;
  execution_time_min?: number;
  stay_time_min?: number;
  notes?: string;
  status?: string;
}
