import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UsuarioDocument = HydratedDocument<Usuario>;
@Schema({ timestamps: true })
export class Usuario {
  @Prop({ required: true })
  nome: string;
  @Prop({ required: true })
  funcao: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
