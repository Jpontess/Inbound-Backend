import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class startReceiptDto {
  @IsNotEmpty()
  @IsString()
  invoiceNumber!: string;

  @IsNumber()
  @IsNotEmpty()
  invoiceWeight!: number;
}
