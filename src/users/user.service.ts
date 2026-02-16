import { Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario, UsuarioDocument } from './Schemas/usuario.schema';
import { Model } from 'mongoose';
import { UsuarioDto } from './createUserDto';
import { UpdateUserDTO } from './updateUserDto';

@Injectable()
export class UsuarioService {
  constructor(@InjectModel(Usuario.name)  private model: Model<UsuarioDocument>) {}

  createUsers(@Body() createUsersDto: UsuarioDto) {
    const newUser = new this.model(createUsersDto);
    return newUser.save();
  }

  getAll() {
    return this.model.find();
  }

  getUserById(id: string ){
    return this.model.findById(id);
  }

  updateUser(id: string, @Body() user : UsuarioDto) {
    return this.model.findByIdAndUpdate(id, user, {new: true}).exec() // Promise
  }

  deleteUser(id: string){
    return this.model.findByIdAndDelete(id).exec()
  }
}
