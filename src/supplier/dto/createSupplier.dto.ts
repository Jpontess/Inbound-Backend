import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class createSupplierDTO {
  @IsNotEmpty()
  @IsString({ message: 'Nome de fornecedor não pode ser vazio' })
  supplier_name!: string;

  @IsOptional()
  @IsBoolean({ message: 'Status deve ser um valor booleano' })
  supplier_status!: boolean;
}
