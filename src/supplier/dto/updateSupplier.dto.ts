import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class updateSupplierDTO {
  @IsNotEmpty({ message: 'Nome de fornecedor não pode ser vazio' })
  @IsString({ message: 'Nome não poder ter números ou caracteres especiais' })
  @IsOptional()
  supplier_name?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Status do fornecedor não pode ser vazio' })
  @IsBoolean({ message: 'Status do fornecedor deve ser um valor booleano' })
  supplier_status?: boolean;
}
