import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Supplier } from "src/supplier/Schemas/suppliers.schema";
import { Usuario } from "src/users/Schemas/usuario.schema";

export type ReceiptDocument = HydratedDocument<Receipt>

@Schema({ timestamps: true }) 
export class Receipt {
    
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: false })
    fornecedor?: Supplier; 

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false })
    usuario?: Usuario; 

    @Prop({ required: false, uppercase: true })
    placa?: string;

    @Prop({ required: false })
    notaFiscal?: string;
    
    @Prop({ required: false })
    pesoNota?: number;  

    @Prop({ required: false })
    pesoBalanca?: number; 
    
    @Prop({ required: false })
    obs?: string;

    @Prop({ required: false })
    dataChegada?: Date; 

    @Prop({ required: false })
    dataInicio?: Date; 

    @Prop({ required: false })
    dataFim?: Date; 

    @Prop({ required: false }) 
    tempoEsperaMin?: number; // (inicio - chegada)

    @Prop({ required: false })
    tempoExecucaoMin?: number; // (fim - inicio)

    @Prop({ required: false })
    tempoPermanenciaMin?: number; // (fim - chegada)

    @Prop({ 
        required: true, 
        enum: ["Agendado", "Aguardando", "Conferindo", "Finalizado", "Divergencia"],
        default: "Aguardando"
    })
    status!: string;
}

export const ReceiptSchema = SchemaFactory.createForClass(Receipt);