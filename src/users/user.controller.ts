import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, Put} from '@nestjs/common';
import { UsuarioService } from './user.service';
import { UsuarioDto } from './createUserDto';
import mongoose from 'mongoose';
import { UpdateUserDTO } from './updateUserDto';

@Controller('user')
export class UsuariosController {
  constructor(private usuarioService: UsuarioService) {}

  @Get()
  listUsers() {
    return this.usuarioService.getAll();
  }

  @Post()
  create(@Body() userNew: UsuarioDto){
    return this.usuarioService.createUsers(userNew)
  }

  // a rota é /user/:id
  @Get(':id')
  getUserById(@Param('id') id: string){
    const idIsvalid =  mongoose.Types.ObjectId.isValid(id) // valida se o id é um objeto
    if(!idIsvalid) throw new HttpException("User not found", 404);

    const findUser = this.usuarioService.getUserById(id);
    if(!findUser) throw new HttpException("User not found", 404);

    return findUser;
  }

  @Patch("update/:id")
  updateUser(@Param("id") id: string, @Body() user: UsuarioDto){
    return this.usuarioService.updateUser(id, user)
  }

  @Delete("delete/:id")
  deleteUser(@Param("id") id: string){
    return this.usuarioService.deleteUser(id)
  }

}
