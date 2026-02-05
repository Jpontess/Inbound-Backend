import { Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario, UsuarioDocument } from './Schemas/usuario.schema';
import { Model } from 'mongoose';
import { UsuarioDto } from './usuario.dto';

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
}
