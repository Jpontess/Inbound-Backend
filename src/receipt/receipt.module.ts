import { Module } from '@nestjs/common';
import { ReceiptController } from './receipt.controller';
import { ReceiptService } from './receipt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Receipt, ReceiptSchema } from './Schemas/receipt.schema';
import {
  Supplier,
  SupplierSchema,
} from 'src/supplier/Schemas/suppliers.schema';
import { ReceiptRepository } from './receipt.repository';
import { SupplierModule } from 'src/supplier/supplier.module';
import { SupplierRepository } from 'src/supplier/supplier.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Receipt.name, schema: ReceiptSchema }]),
    MongooseModule.forFeature([
      { name: Supplier.name, schema: SupplierSchema },
    ]),
    SupplierModule,
  ],
  controllers: [ReceiptController],
  providers: [ReceiptService, ReceiptRepository, SupplierRepository],
})
export class ReceiptModule {}
