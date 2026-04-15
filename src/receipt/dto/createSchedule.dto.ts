import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateScheduleDto {
  @IsNotEmpty()
  @IsMongoId()
  supplier_id!: string;

  @IsString()
  supplier_name?: string;

  @IsNumber()
  invoice_weight?: number;

  @IsDateString()
  scheduling_date?: string;

  @IsString()
  @IsNotEmpty()
  status!: string;
}
