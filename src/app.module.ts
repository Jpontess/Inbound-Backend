import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonAuthModule } from './common/auth/auth.module';
import { ReceiptModule } from './receipt/receipt.module';
import { SupplierModule } from './supplier/supplier.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGO_URI_DB'),
      }),
      inject: [ConfigService],
    }),
    CommonAuthModule,
    AuthModule,
    SupplierModule,
    ReceiptModule,
    UserModule,
  ],
})
export class AppModule {}
