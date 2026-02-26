import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { ReceiptService } from './receipt.service';
import { CreateReceiptDto } from './dto/createReceipt.dto';
import { UpdateReceiptDto } from './dto/updateReceipt.dto';
import { FinishReceipt } from './dto/finishReceipt.dto';
import { startReceiptDto } from './dto/startReceipt.dto';

@Controller('receipt')
export class ReceiptController {
  constructor(private service: ReceiptService) {}

  @Post()
  create(@Body() newReceipt: CreateReceiptDto) {
    return this.service.createReceipt(newReceipt);
  }

  @Post('schedule')
  createSchedule(@Body() newSchedule: CreateReceiptDto) {
    return this.service.createSchedule(newSchedule);
  }

  @Get()
  async listReceipt() {
    return await this.service.listReceipt();
  }

  @Get(':id')
  async receiptById(@Param('id') id: string) {
    return await this.service.receiptById(id);
  }

  @Patch(':id')
  async updateReceipt(
    @Param('id') id: string,
    @Body() updateNew: UpdateReceiptDto,
  ) {
    return await this.service.updateReceipt(id, updateNew);
  }

  @Delete(':id')
  async deleteReceipt(@Param('id') id: string) {
    return await this.service.deleteReceipt(id);
  }

  @Post(':id')
  async startReceipt(
    @Param('id') id: string,
    @Body() receipt: startReceiptDto,
  ) {
    return await this.service.startReceipt(id, receipt);
  }

  @Post('finish/:id')
  async finishReceipt(@Param('id') id: string, @Body() receipt: FinishReceipt) {
    return await this.service.finishReceipt(id, receipt);
  }

  @Patch(':id/input')
  async inputByPlate(
    @Param('id') id: string,
    @Body() updateReceipt: UpdateReceiptDto,
  ) {
    return await this.service.inputByPlate(id, updateReceipt);
  }
}
