import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome não pode estar vazio' })
  name!: string;

  @IsEmail({}, { message: 'O e-mail deve ser um endereço válido' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  password!: string;

  @IsString() // Ou @IsEnum(UserRole) se você usar o enum acima
  @IsNotEmpty()
  roles!: string;
}
