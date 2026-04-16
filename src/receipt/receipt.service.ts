import { Injectable } from '@nestjs/common';
import { CreateReceiptDto } from './dto/createReceipt.dto';
import { FinishReceipt } from './dto/finishReceipt.dto';
import { UpdateReceiptDto } from './dto/updateReceipt.dto';
import { startReceiptDto } from './dto/startReceipt.dto';
import { Logger } from '@nestjs/common';
import { ReceiptRepository } from './receipt.repository';
import { SupplierRepository } from '../supplier/supplier.repository';
import { CreateScheduleDto } from './dto/createSchedule.dto';

@Injectable()
export class ReceiptService {
  private readonly logger = new Logger(ReceiptService.name);
  constructor(
    private readonly receiptRepository: ReceiptRepository,
    private readonly supplierRepository: SupplierRepository,
  ) {}

  // Criar um novo recebimento
  async createReceipt(newReceiptDto: CreateReceiptDto) {
    const supplier = await this.supplierRepository.findById(
      newReceiptDto.supplier_id,
    );

    if (!supplier) {
      this.logger.error(
        `Supplier with ID ${newReceiptDto.supplier_id} not found`,
      );
      throw new Error('Supplier not found');
    }

    const newReceipt = await this.receiptRepository.create({
      ...newReceiptDto,
      supplier_id: newReceiptDto.supplier_id,
      license_plate: newReceiptDto.license_plate,
      supplier_name: supplier.supplier_name,
      arrival_date: new Date(),
      status: 'Aguardando',
    });

    this.logger.log(`Creating receipt for supplier ${supplier?.supplier_name}`);
    return newReceipt.save();
  }
  // Criar um novo agendamento
  async createSchedule(newScheduleDto: CreateScheduleDto) {
    const supplier = await this.supplierRepository.findById(
      newScheduleDto.supplier_id,
    );

    const newSchedule = await this.receiptRepository.createSchedule({
      supplier_id: newScheduleDto.supplier_id,
      supplier_name: supplier?.supplier_name,
      invoice_weight: newScheduleDto.invoice_weight,
      scheduling_date: newScheduleDto.scheduling_date,
      status: 'Agendado',
    });

    this.logger.log(
      `Creating schedule for supplier ${supplier?.supplier_name} on ${newScheduleDto.scheduling_date}`,
    );
    return newSchedule.save();
  }

  //obter a lista de recebimentos
  async listReceipt() {
    this.logger.log('Fetching all receipts');
    return await this.receiptRepository.findAll();
  }

  // recebimento por Id
  async receiptById(id: string) {
    this.logger.log(`Fetching receipt with ID ${id}`);
    return await this.receiptRepository.findById(id);
  }

  // atualiza o recebimento
  async updateReceipt(id: string, newUpdate: UpdateReceiptDto) {
    const receipt_id = await this.receiptRepository.update(id, newUpdate);
    if (!receipt_id) throw new Error('Receipt not found');

    if (receipt_id.invoice_weight! < newUpdate.scale_weight!) {
      return await this.receiptRepository.update(id, { status: 'Divergencia' });
    } else if (
      newUpdate.scale_weight == 0 &&
      receipt_id.status === 'Agendado'
    ) {
      return await this.receiptRepository.update(id, { status: 'Agendado' });
    } else if (receipt_id.invoice_weight! >= newUpdate.scale_weight!) {
      return await this.receiptRepository.update(id, { status: 'Finalizado' });
    }

    this.logger.log(
      `Updating receipt with ID ${id} with new data ${JSON.stringify(newUpdate)}`,
    );
    return receipt_id;
  }

  // deleta o recebimento
  async deleteReceipt(id: string) {
    this.logger.log(`Deleting receipt with ID ${id}`);
    return await this.receiptRepository.delete(id);
  }
  // inicia a conferência do recebimento
  async startReceipt(id: string, startReceiptDto: startReceiptDto) {
    const receiptDb = await this.receiptRepository.findById(id);

    const inicioRecebimento = new Date().getTime();
    const tempoChegada = receiptDb?.arrival_date
      ? new Date(receiptDb.arrival_date).getTime()
      : 0;

    const tempoEspera =
      inicioRecebimento > 0
        ? Math.floor((inicioRecebimento - tempoChegada) / 60000)
        : 0;

    this.logger.log(
      `Starting receipt with ID ${id} for invoice number ${startReceiptDto.invoice_number}`,
    );
    return await this.receiptRepository.update(id, {
      ...startReceiptDto,
      status: 'Conferindo',
      start_date: inicioRecebimento,
      wait_time_min: tempoEspera,
    });
  }

  // finaliza a conferência do recebimento
  async finishReceipt(id: string, receipt: FinishReceipt) {
    const receiptDb = await this.receiptRepository.findById(id);

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
    this.logger.log(
      `Finishing receipt with ID ${id} with status ${statusReceipt}`,
    );
    return await this.receiptRepository.update(id, {
      ...receipt,
      status: statusReceipt,
      end_date: recebimentoFim,
      execution_time_min: executionTime,
      stay_time_min: permanenceTime,
    });
  }

  // atualiza o status de aguadando para recebimento agendado pela placa
  async inputByPlate(id: string, updateReceipt: UpdateReceiptDto) {
    this.logger.log(`Updating receipt with ID ${id} to status Aguardando`);
    return await this.receiptRepository.update(id, {
      ...updateReceipt,
      status: 'Aguardando',
      arrival_date: new Date(),
    });
  }
}
