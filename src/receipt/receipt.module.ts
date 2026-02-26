import { Module } from '@nestjs/common';
import { ReceiptController } from './receipt.controller';
import { ReceiptService } from './receipt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Receipt, ReceiptSchema } from './Schemas/receipt.schema';
import {
  Supplier,
  SupplierSchema,
} from 'src/supplier/Schemas/suppliers.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Receipt.name, schema: ReceiptSchema }]),
    MongooseModule.forFeature([
      { name: Supplier.name, schema: SupplierSchema },
    ]),
  ],
  controllers: [ReceiptController],
  providers: [ReceiptService],
})
export class ReceiptModule {}
