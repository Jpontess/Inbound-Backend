import { Module } from "@nestjs/common";
import { ReceiptController } from "./receipt.controller";
import { ReceiptService } from "./receipt.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Receipt, ReceiptSchema } from "./Schemas/receipt.schema";
import { Supplier, SupplierSchema } from "src/supplier/Schemas/suppliers.schema";
import { Usuario, UsuarioSchema } from "src/users/Schemas/usuario.schema";

@Module({
    imports: [
        MongooseModule.forFeature([{name: Receipt.name, schema:ReceiptSchema }]),
        MongooseModule.forFeature([{name: Supplier.name, schema: SupplierSchema}]),
        MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }])
    ],
    controllers:[ReceiptController],
    providers: [ReceiptService]
})

export class ReceiptModule {}