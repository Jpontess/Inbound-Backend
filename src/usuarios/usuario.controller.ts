import { Body, Controller, Get, Post} from "@nestjs/common";
import { UsuarioService } from "./usuario.service";
import { UsuarioDto } from "./usuario.dto";
import { Usuario } from "./interfaces/usuario.interface";

@Controller("/usuarios")
export class UsuariosController {
 
    constructor(private  usuarioService: UsuarioService) {}

    @Get()
  async  ListarUsuarios(): Promise<Usuario[]>{
        return this.usuarioService.ListarUsuarios();
    }

    @Post()
  async criarUsuario(@Body() usuarioDto: UsuarioDto){
        return this.usuarioService.criarUsuario(usuarioDto.nome, usuarioDto.funcao);
    }
}