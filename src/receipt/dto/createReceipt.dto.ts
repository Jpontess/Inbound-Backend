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
  fornecedor!: Supplier;

  @IsOptional()
  @IsString()
  nomeFornecedor!: string;

  @IsOptional()
  @IsString()
  placa!: string;

  @IsOptional()
  @IsDateString()
  dataAgendamento?: string;

  @IsOptional()
  @IsNumber()
  pesoNota?: number;
}
