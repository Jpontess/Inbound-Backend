import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuariosModule } from './users/usuario.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://Admin:livup123@system.hcaxe2j.mongodb.net/?appName=System',
    ),
    UsuariosModule
  ],
})
export class AppModule {}
