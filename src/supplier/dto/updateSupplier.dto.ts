import { IsNotEmpty, IsString } from 'class-validator';

export class updateSupplierDTO {
  @IsNotEmpty({ message: 'Nome de fornecedor não pode ser vazio' })
  @IsString({ message: 'Nome não poder ter números ou caracteres especiais' })
  nome!: string;
}
