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
  fornecedor?: Supplier;

  @IsOptional()
  @IsString()
  placa?: string;

  @IsOptional()
  @IsString()
  notaFiscal?: string;

  @IsNumber()
  @IsOptional()
  pesoNota?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  pesoBalanca?: number;

  @IsString()
  @IsOptional()
  Obs?: string;

  @IsOptional()
  dataAgendamento?: string;

  @IsOptional()
  dataChegada?: Date;

  @IsOptional()
  dataFim?: Date;

  @IsOptional()
  dataInicio?: Date;

  @IsOptional()
  tempoEsperaMin?: number;

  @IsOptional()
  tempoExecusaoMin?: number;

  @IsOptional()
  tempoPemanenciaMin?: number;

  @IsString()
  @IsOptional()
  status?: string;
}
