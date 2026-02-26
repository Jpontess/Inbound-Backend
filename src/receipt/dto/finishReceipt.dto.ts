import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class FinishReceipt {
  @IsNotEmpty()
  @IsNumber()
  scaleWeight!: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  status?: 'Finalizado' | 'Divergencia';
}
