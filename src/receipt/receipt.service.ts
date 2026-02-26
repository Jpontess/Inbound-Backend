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
      newReceiptDto.fornecedor,
    ); // id do fornecedor

    const newReceipt = new this.model({
      placa: newReceiptDto.placa,
      supplier_Id: newReceiptDto.fornecedor,
      nomeFornecedor: supplier?.name,
      dataChegada: new Date(),
      status: 'Aguardando',
    });
    return newReceipt.save();
  }

  async createSchedule(newScheduleDto: CreateReceiptDto) {
    const supplier = await this.modelSupplier.findById(
      newScheduleDto.fornecedor,
    ); // id do fornecedor

    const newSchedule = new this.model({
      fornecedor: newScheduleDto.fornecedor,
      nomeFornecedor: supplier?.name,
      pesoNota: newScheduleDto.pesoNota,
      dataAgendamento: newScheduleDto.dataAgendamento,
      status: 'Agendado',
    });
    return newSchedule.save();
  }

  // lista de recebimento
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
    const tempoChegada = receiptDb?.startDate
      ? new Date(receiptDb.startDate).getTime()
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
        dataInicio: inicioRecebimento,
        tempoEsperaMin: tempoEspera,
      },
      { new: true },
    );
  }

  // finaliza um recebimento
  async finishReceipt(id: string, receipt: FinishReceipt) {
    const receiptDb = await this.model.findById(id);

    const recebimentoFim = new Date();

    // passando as props date para getTime()
    const chegadaTempo = receiptDb?.startDate
      ? new Date(receiptDb.startDate).getTime()
      : 0;
    const inicioTempo = receiptDb?.startDate
      ? new Date(receiptDb.startDate).getTime()
      : 0;
    const finalTempo = recebimentoFim.getTime();

    const tempoPermanencia =
      chegadaTempo > 0 ? Math.floor((finalTempo - chegadaTempo) / 60000) : 0;
    const tempoExecucao =
      inicioTempo > 0 ? Math.floor((finalTempo - inicioTempo) / 60000) : 0;

    let statusReceipt = receipt.status;
    const pesoNota = receiptDb?.invoiceWeight;

    if (receipt.scaleWeight >= pesoNota!) {
      statusReceipt = 'Finalizado';
    } else {
      statusReceipt = 'Divergencia';
    }

    return await this.model.findByIdAndUpdate(
      id,
      {
        ...receipt,
        status: statusReceipt,
        dataFim: recebimentoFim,
        tempoExecucaoMin: tempoExecucao,
        tempoPermanenciaMin: tempoPermanencia,
      },
      { new: true },
    );
  }

  async inputByPlate(id: string, updateReceipt: UpdateReceiptDto) {
    return await this.model.findByIdAndUpdate(
      id,
      { ...updateReceipt, status: 'Aguardando', dataChegada: new Date() },
      { new: true },
    );
  }
}
