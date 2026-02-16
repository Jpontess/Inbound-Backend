import { IsString } from "class-validator"

export class UpdateUserDTO {
    @IsString()
    nome?: string

    @IsString()
    funcao?: string
}