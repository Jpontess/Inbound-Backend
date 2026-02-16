import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from './Schemas/usuario.schema';
import { UsuariosController } from './user.controller';
import { UsuarioService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
  ],
  controllers: [UsuariosController],
  providers: [UsuarioService],
})
export class UsuariosModule {}
