import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

@Injectable()
export class S3Service {
  private s3: S3Client;

  constructor(private readonly config: ConfigService) {
    this.s3 = new S3Client({
      region: this.config.getOrThrow<string>('S3_REGION'),
    });
  }

  async getObject(bucketName: string, path: string): Promise<string> {
    if (!path) throw new Error('Missing path at getObject');

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: path,
    });

    const response = await this.s3.send(command);
    if (response.Body instanceof Readable) {
      return await this.streamToString(response.Body);
    }
    throw new Error('Invalid response body from S3');
  }

  private async streamToString(stream: Readable): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      stream.on('data', (chunk: Uint8Array) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    });
  }
}
