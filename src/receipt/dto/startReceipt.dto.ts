import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class startReceiptDto {
  @IsNotEmpty()
  @IsString()
  invoice_number!: string;

  @IsNumber()
  @IsNotEmpty()
  invoice_weight!: number;

  @IsString()
  @IsNotEmpty()
  user_name!: string;
}
