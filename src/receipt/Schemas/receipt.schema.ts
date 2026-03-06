import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Supplier } from 'src/supplier/Schemas/suppliers.schema';

export type ReceiptDocument = HydratedDocument<Receipt>;

@Schema({
  timestamps: true,
  collection: 'inbound_manager_receivings',
})
export class Receipt {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: false,
  })
  supplier_Id?: Supplier;

  @Prop({ required: false })
  supplierName?: string;

  @Prop({ required: false })
  UserName?: string;

  @Prop({ required: false, uppercase: true })
  licensePlate?: string; // placa

  @Prop({ required: false })
  invoiceNumber?: string; // numeroNota

  @Prop({ required: false })
  invoiceWeight?: number; // pesoNota

  @Prop({ required: false })
  scaleWeight?: number; // pesoBalança

  @Prop({ required: false })
  notes?: string; // observações

  @Prop({ required: false })
  schedulingDate?: Date; // dataAgendamento

  @Prop({ required: false })
  arrivalDate?: Date; // dataChegada

  @Prop({ required: false })
  startDate?: Date; // dataInicio

  @Prop({ required: false })
  endDate?: Date; // dataFim

  @Prop({ required: false })
  waitTimeMin?: number; // tempoEsperaMin

  @Prop({ required: false })
  executionTimeMin?: number; // tempoExecucaoMin

  @Prop({ required: false })
  stayTimeMin?: number; // tempoPermanenciaMin

  @Prop({
    required: true,
    enum: ['Agendado', 'Aguardando', 'Conferindo', 'Finalizado', 'Divergencia'],
    default: 'Aguardando',
  })
  status!: string;
}

export const ReceiptSchema = SchemaFactory.createForClass(Receipt);
