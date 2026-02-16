import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Supplier } from "src/supplier/Schemas/suppliers.schema";
import { Usuario } from "src/users/Schemas/usuario.schema";

export class UpdateReceiptDto {

    @IsOptional()
    @IsMongoId()
    fornecedor?: Supplier
    
    @IsOptional()
    @IsMongoId()
    usuario?: Usuario 
   
    @IsOptional()
    @IsString()
    placa?: string
    
    @IsOptional()
    @IsString()
    notaFiscal?: string
    
    
    @IsNumber()
    @IsOptional()
    pesoNota?:number

    @IsNotEmpty()
    @IsNumber()
    pesoBalanca?: number


    @IsString()
    @IsOptional()
    Obs?:string

    @IsOptional()
    dataChegada?: Date

    @IsOptional()
    dataFim?: Date

    @IsOptional()
    dataInicio?: Date

    @IsOptional()
    tempoEsperaMin?: number

    @IsOptional()
    tempoExecusaoMin?: number

    @IsOptional()
    tempoPemanenciaMin?: number

    @IsString()
    @IsOptional()
    status?: string
}