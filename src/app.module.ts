import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuariosModule } from './users/user.module';
import { SupplierModule } from './supplier/supplier.module';
import { ReceiptModule } from './receipt/receipt.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGO_URI"),
      }),
      inject: [ConfigService]
    }),

    UsuariosModule,
    SupplierModule,
    ReceiptModule
  ],
})
export class AppModule {}
