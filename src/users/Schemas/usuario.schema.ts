import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UsuarioDocument = HydratedDocument<Usuario>;
@Schema({ timestamps: true })
export class Usuario {
  @Prop({ required: true })
  nome!: string;

  @Prop({ required : true})
  email!: string

  @Prop({ required: true })
  funcao?: string;

  @Prop({required: false})
  turno?: string
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
