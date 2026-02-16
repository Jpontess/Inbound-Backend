/* eslint-disable @typescript-eslint/no-unsafe-call */
import {IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UsuarioDto {
  @IsNotEmpty()
  @IsString()
  nome!: string;

  @IsEmail()
  email!: string

  @IsString()
  funcao!: string;

  @IsString()
  Turno!: string
}
