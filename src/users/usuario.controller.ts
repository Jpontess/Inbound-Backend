import { Body, Controller, Get, Post} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioDto } from './usuario.dto';

@Controller('user')
export class UsuariosController {
  constructor(private usuarioService: UsuarioService) {}

  @Get()
  lista() {
    return this.usuarioService.getAll();
  }

  @Post()
  create(@Body() userNew: UsuarioDto){
    return this.usuarioService.createUsers(userNew)
  }
}
