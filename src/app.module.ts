import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios/usuario.controller';
import { UsuarioService } from './usuarios/usuario.service';


@Module({
  imports: [],
  controllers: [UsuariosController],
  providers: [UsuarioService],
})
export class AppModule {}