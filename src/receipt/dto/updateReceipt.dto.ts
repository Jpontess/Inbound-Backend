import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Supplier } from 'src/supplier/Schemas/suppliers.schema';

export class UpdateReceiptDto {
  @IsOptional()
  @IsMongoId()
  supplier_id?: Supplier;

  @IsOptional()
  @IsString()
  license_plate?: string;

  @IsOptional()
  @IsString()
  invoice_number?: string;

  @IsNumber()
  @IsOptional()
  invoice_weight?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  scale_weight?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsOptional()
  scheduling_date?: string;

  @IsOptional()
  arrival_date?: Date;

  @IsOptional()
  end_date?: Date;

  @IsOptional()
  start_date?: number;

  @IsOptional()
  wait_time_min?: number;

  @IsOptional()
  execution_time_min?: number;

  @IsOptional()
  stay_time_min?: number;

  @IsString()
  @IsOptional()
  status?: string;
}
