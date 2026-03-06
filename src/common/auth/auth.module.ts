import { Module } from '@nestjs/common';
import { AuthenticationGuard } from './guards/authentication.guard';
import { JWTValidator } from './services/jwt-validator.service';
import { S3Service } from './services/s3.service';

@Module({
  providers: [AuthenticationGuard, JWTValidator, S3Service],
  exports: [JWTValidator],
})
export class AuthModule {}
