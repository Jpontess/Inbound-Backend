import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type SupplierDocument = HydratedDocument<Supplier>

@Schema({timestamps: true})
export class Supplier {
    @Prop({required: true})
    nome!: string

    @Prop({required: false})
    status!: boolean

}

export const SupplierSchema = SchemaFactory.createForClass(Supplier)