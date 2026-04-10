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
  supplier_id?: Supplier;

  @Prop({ required: false })
  supplier_name?: string;

  @Prop({ required: false })
  user_name?: string;

  @Prop({ required: false, uppercase: true })
  license_plate?: string; // placa

  @Prop({ required: false })
  invoice_number?: string; // numeroNota

  @Prop({ required: false })
  invoice_weight?: number; // pesoNota

  @Prop({ required: false })
  scale_weight?: number; // pesoBalança

  @Prop({ required: false })
  notes?: string; // observações

  @Prop({ required: false })
  scheduling_date?: Date; // dataAgendamento

  @Prop({ required: false })
  arrival_date?: Date; // dataChegada

  @Prop({ required: false })
  start_date?: Date; // dataInicio

  @Prop({ required: false })
  end_date?: Date; // dataFim

  @Prop({ required: false })
  wait_time_min?: number; // tempoEsperaMin

  @Prop({ required: false })
  execution_time_min?: number; // tempoExecucaoMin

  @Prop({ required: false })
  stay_time_min?: number; // tempoPermanenciaMin

  @Prop({
    required: true,
    enum: ['Agendado', 'Aguardando', 'Conferindo', 'Finalizado', 'Divergencia'],
    default: 'Aguardando',
  })
  status!: string;
}

export const ReceiptSchema = SchemaFactory.createForClass(Receipt);
