/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsString } from 'class-validator';

export class UsuarioDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsString()
  funcao: string;
}
