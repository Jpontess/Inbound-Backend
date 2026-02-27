import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';

import { S3Service } from './s3.service';

interface BasicClaims {
  id: string;
  scopes: string[];
  iat: number;
  exp: number;
  aud: string;
  iss: string;
  sub: string;
  kind: 'acc' | 'ref';
}

@Injectable()
export class JWTValidator implements OnModuleInit {
  private publicKey: string;

  constructor(
    private readonly s3: S3Service,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    this.publicKey = await this.s3
      .getObject(
        this.config.getOrThrow<string>('S3_BUCKET_NAME'),
        this.config.getOrThrow<string>('S3_PUBLIC_KEY_PATH'),
      )
      .then((body) => body.toString());
  }

  validate = async <T>(token: string) =>
    new Promise<T & BasicClaims>((resolve, reject) => {
      jwt.verify(
        token,
        this.publicKey,
        {
          algorithms: ['RS256'],
          issuer: this.config.getOrThrow<string>('S3_ISSUER'),
          clockTimestamp: Math.floor(+new Date() / 1000),
          clockTolerance: 0,
        },
        (err, data: T & BasicClaims) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(data);
        },
      );
    });
}
