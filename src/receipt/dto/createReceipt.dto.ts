import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Supplier } from 'src/supplier/Schemas/suppliers.schema';

export class CreateReceiptDto {
  @IsNotEmpty()
  @IsMongoId()
  supplier_id!: Supplier;

  @IsOptional()
  @IsString()
  supplier_name!: string;

  @IsOptional()
  @IsString()
  license_plate!: string;

  @IsOptional()
  @IsDateString()
  scheduling_date?: string;

  @IsOptional()
  @IsNumber()
  invoice_weight?: number;
}
