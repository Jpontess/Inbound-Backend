import { Module } from "@nestjs/common";
import { ReceiptController } from "./receipt.controller";
import { ReceiptService } from "./receipt.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Receipt, ReceiptSchema } from "./Schemas/receipt.schema";

@Module({
    imports: [
        MongooseModule.forFeature([{name: Receipt.name, schema:ReceiptSchema }])
    ],
    controllers:[ReceiptController],
    providers: [ReceiptService]
})

export class ReceiptModule {}