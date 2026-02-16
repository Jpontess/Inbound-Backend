import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class supplierDto {
    
    @IsNotEmpty()
    @IsString({message: "Nome de fornecedor não pode ser vazio"})
    nome!: string
    
    @IsBoolean()
    status!: {
        type: boolean, default: true
    }
}