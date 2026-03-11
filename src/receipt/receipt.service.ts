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
      newReceiptDto.supplier_Id,
    );

    const newReceipt = new this.model({
      ...newReceiptDto,
      licensePlate: newReceiptDto.licensePlate,
      supplier_Id: newReceiptDto.supplier_Id,
      supplierName: supplier?.name,
      arrivalDate: new Date(),
      status: 'Aguardando',
    });
    return newReceipt.save();
  }

  async createSchedule(newScheduleDto: CreateReceiptDto) {
    const supplier = await this.modelSupplier.findById(
      newScheduleDto.supplier_Id,
    );

    const newSchedule = new this.model({
      supplier_Id: newScheduleDto.supplier_Id,
      supplierName: supplier?.name,
      invoiceWeight: newScheduleDto.invoiceWeight,
      schedulingDate: newScheduleDto.schedulingDate,
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
    return await this.model.findByIdAndUpdate(id, newUpdate, { new: true });
  }

  // deleta o recebimento
  async deleteReceipt(id: string) {
    return await this.model.findByIdAndDelete(id);
  }

  async startReceipt(id: string, startReceiptDto: startReceiptDto) {
    const receiptDb = await this.model.findById(id);

    const inicioRecebimento = new Date().getTime();
    const tempoChegada = receiptDb?.arrivalDate
      ? new Date(receiptDb.arrivalDate).getTime()
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
        startDate: inicioRecebimento,
        waitTimeMin: tempoEspera,
      },
      { new: true },
    );
  }

  // finaliza um recebimento
  async finishReceipt(id: string, receipt: FinishReceipt) {
    const receiptDb = await this.model.findById(id);

    const recebimentoFim = new Date();

    // passando as props date para getTime()
    const timeArrival = receiptDb?.arrivalDate
      ? new Date(receiptDb.arrivalDate).getTime()
      : 0;
    const timeStart = receiptDb?.startDate
      ? new Date(receiptDb.startDate).getTime()
      : 0;
    const timeEnd = recebimentoFim.getTime();

    const permanenceTime =
      timeArrival > 0 ? Math.floor((timeEnd - timeArrival) / 60000) : 0;
    const executionTime =
      timeStart > 0 ? Math.floor((timeEnd - timeStart) / 60000) : 0;

    let statusReceipt = receipt.status;
    const pesoNota = receiptDb?.invoiceWeight;

    if (receipt.scaleWeight >= pesoNota!) {
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
          endDate: recebimentoFim,
          executionTimeMin: executionTime,
          stayTimeMin: permanenceTime,
        },
        { new: true },
      )
      .select('-createdAt -updatedAt -__v');
  }

  async inputByPlate(id: string, updateReceipt: UpdateReceiptDto) {
    return await this.model.findByIdAndUpdate(
      id,
      { ...updateReceipt, status: 'Aguardando', arrivalDate: new Date() },
      { new: true },
    );
  }
}
