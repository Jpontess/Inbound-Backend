import { Injectable } from '@nestjs/common';
import {
  Receipt as ReceiptModel,
  ReceiptDocument,
} from './Schemas/receipt.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReceiptDto } from './dto/createReceipt.dto';
import { UpdateReceiptDto } from './dto/updateReceipt.dto';
import { CreateScheduleDto } from './dto/createSchedule.dto';

@Injectable()
export class ReceiptRepository {
  constructor(
    @InjectModel(ReceiptModel.name)
    private readonly ReceiptModel: Model<ReceiptDocument>,
  ) {}

  //Criar um novo recebimento
  async create(receiptCreate: CreateReceiptDto) {
    const newReceipt = new this.ReceiptModel({
      ...receiptCreate,
    });
    return newReceipt.save();
  }
  // Criar um novo agendamento
  async createSchedule(newScheduleDto: CreateScheduleDto) {
    const newSchedule = new this.ReceiptModel({
      ...newScheduleDto,
    });
    return newSchedule.save();
  }

  // Listar todos os recebimentos
  async findAll() {
    return this.ReceiptModel.find().exec();
  }

  // Recebimento por Id
  async findById(id: string) {
    return this.ReceiptModel.findById(id).exec();
  }

  // Atualizar um recebimento
  async update(id: string, receiptUpdate: UpdateReceiptDto) {
    return this.ReceiptModel.findByIdAndUpdate(id, receiptUpdate, {
      new: true,
    }).exec();
  }

  // Deletar um recebimento
  async delete(id: string) {
    return this.ReceiptModel.findById(id).exec();
  }
}
