import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Supplier } from "src/supplier/Schemas/suppliers.schema";

export class CreateReceiptDto {
    @IsNotEmpty()
    @IsMongoId()
    fornecedor!: Supplier

    @IsNotEmpty()
    @IsMongoId()
    usuario!: string
    
    @IsOptional()    
    @IsString()
    placa?: string 
}



