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
  supplier_Id!: Supplier;

  @IsOptional()
  @IsString()
  supplierName!: string;

  @IsOptional()
  @IsString()
  licensePlate!: string;

  @IsOptional()
  @IsDateString()
  schedulingDate?: string;

  @IsOptional()
  @IsNumber()
  invoiceWeight?: number;
}
