import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class startReceiptDto {
  @IsNotEmpty()
  @IsString()
  notaFiscal!: string;

  @IsNumber()
  @IsNotEmpty()
  pesoNota!: number;
}
