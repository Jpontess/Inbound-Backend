import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class FinishReceipt {
  @IsNotEmpty()
  @IsNumber()
  scale_weight!: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  status?: 'Finalizado' | 'Divergencia';
}
