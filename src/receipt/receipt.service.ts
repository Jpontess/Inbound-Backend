import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Receipt, ReceiptDocument } from './Schemas/receipt.schema';
import { CreateReceiptDto } from './dto/createReceipt.dto';
import { FinishReceipt } from './dto/finishReceipt.dto';
import {
  Supplier,
  SupplierDocument,
} from 'src/supplier/Schemas/suppliers.schema';
import { UpdateReceiptDto } from './dto/updateReceipt.dto';
import { startReceiptDto } from './dto/startReceipt.dto';

@Injectable()
export class ReceiptService {
  constructor(
    @InjectModel(Receipt.name) private model: Model<ReceiptDocument>,
    @InjectModel(Supplier.name) private modelSupplier: Model<SupplierDocument>,
  ) {}

  async createReceipt(newReceiptDto: CreateReceiptDto) {
    const supplier = await this.modelSupplier.findById(
      newReceiptDto.supplier_id,
    );

    const newReceipt = new this.model({
      ...newReceiptDto,
      license_plate: newReceiptDto.license_plate,
      supplier_id: newReceiptDto.supplier_id,
      supplier_name: supplier?.supplier_name,
      arrival_date: new Date(),
      status: 'Aguardando',
    });
    return newReceipt.save();
  }

  async createSchedule(newScheduleDto: CreateReceiptDto) {
    const supplier = await this.modelSupplier.findById(
      newScheduleDto.supplier_id,
    );

    const newSchedule = new this.model({
      supplier_id: newScheduleDto.supplier_id,
      supplier_name: supplier?.supplier_name,
      invoice_weight: newScheduleDto.invoice_weight,
      scheduling_date: newScheduleDto.scheduling_date,
      status: 'Agendado',
    });
    return newSchedule.save();
  }

  async listReceipt() {
    return await this.model.find();
  }

  // recebimento por Id
  async receiptById(id: string) {
    return await this.model.findById(id);
  }

  // atualiza o recebimento
  async updateReceipt(id: string, newUpdate: UpdateReceiptDto) {
    const receipt_id = await this.model.findByIdAndUpdate(id, newUpdate, {
      new: true,
    });
    if (!receipt_id) return Error('Recebimento não encontrado');

    if (receipt_id.invoice_weight! < newUpdate.scale_weight!) {
      return await this.model.findByIdAndUpdate(
        id,
        { status: 'Divergencia' },
        { new: true },
      );
    } else if (
      newUpdate.scale_weight == 0 &&
      receipt_id.status === 'Agendado'
    ) {
      return await this.model.findOneAndUpdate(
        { _id: id },
        { status: 'Agendado' },
        { new: true },
      );
    } else if (receipt_id.invoice_weight! >= newUpdate.scale_weight!) {
      return await this.model.findByIdAndUpdate(
        { _id: id },
        { status: 'Finalizado' },
        { new: true },
      );
    }

    return receipt_id;
  }

  // deleta o recebimento
  async deleteReceipt(id: string) {
    return await this.model.findByIdAndDelete(id);
  }

  async startReceipt(id: string, startReceiptDto: startReceiptDto) {
    const receiptDb = await this.model.findById(id);

    const inicioRecebimento = new Date().getTime();
    const tempoChegada = receiptDb?.arrival_date
      ? new Date(receiptDb.arrival_date).getTime()
      : 0;

    const tempoEspera =
      inicioRecebimento > 0
        ? Math.floor((inicioRecebimento - tempoChegada) / 60000)
        : 0;

    return await this.model.findByIdAndUpdate(
      id,
      {
        ...startReceiptDto,
        status: 'Conferindo',
        start_date: inicioRecebimento,
        wait_time_min: tempoEspera,
      },
      { new: true },
    );
  }

  // finaliza um recebimento
  async finishReceipt(id: string, receipt: FinishReceipt) {
    const receiptDb = await this.model.findById(id);

    const recebimentoFim = new Date();

    // passando as props date para getTime()
    const timeArrival = receiptDb?.arrival_date
      ? new Date(receiptDb.arrival_date).getTime()
      : 0;
    const timeStart = receiptDb?.start_date
      ? new Date(receiptDb.start_date).getTime()
      : 0;
    const timeEnd = recebimentoFim.getTime();

    const permanenceTime =
      timeArrival > 0 ? Math.floor((timeEnd - timeArrival) / 60000) : 0;
    const executionTime =
      timeStart > 0 ? Math.floor((timeEnd - timeStart) / 60000) : 0;

    let statusReceipt = receipt.status;
    const pesoNota = receiptDb?.invoice_weight;

    if (receipt.scale_weight >= pesoNota!) {
      statusReceipt = 'Finalizado';
    } else {
      statusReceipt = 'Divergencia';
    }

    return await this.model
      .findByIdAndUpdate(
        id,
        {
          ...receipt,
          status: statusReceipt,
          end_date: recebimentoFim,
          execution_time_min: executionTime,
          stay_time_min: permanenceTime,
        },
        { new: true },
      )
      .select('-createdAt -updatedAt -__v');
  }

  async inputByPlate(id: string, updateReceipt: UpdateReceiptDto) {
    return await this.model.findByIdAndUpdate(
      id,
      { ...updateReceipt, status: 'Aguardando', arrival_date: new Date() },
      { new: true },
    );
  }
}
