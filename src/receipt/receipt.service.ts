import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Receipt, ReceiptDocument } from "./Schemas/receipt.schema";
import { CreateReceiptDto } from "./ReceiptDTO/createReceipt.dto";
import { UpdateReceiptDto } from "./ReceiptDTO/updateReceipt.dto";
import { FinishReceipt } from "./ReceiptDTO/finishReceipt.dto";

@Injectable()
export class ReceiptService {
    constructor(@InjectModel(Receipt.name) private model: Model<ReceiptDocument>){}


    // cria recebimento portaria
    createReceipt( newReceiptDto: CreateReceiptDto){
        const newReceipt = new this.model({
            ...newReceiptDto, // pego todas as props to DTO
            dataChegada: new Date(),
            status: "Aguardando"
        })
        return newReceipt.save()
    }

    // lista de recebimento
    async listReceipt(){
        return await this.model.find()
    }

    // recebimento por Id
    async receiptById(id : string){
        return await this.model.findById(id)
    }

    // atualiza o recebimento
    async updateReceipt(id: string, newUpdate: CreateReceiptDto){
        return await this.model.findByIdAndUpdate(id, newUpdate, {new: true})
    }

    // deleta o recebimento
    async deleteReceipt(id : string){
        return await this.model.findByIdAndDelete(id)
    }

    async startReceipt(id: string, pesoNotaDto: number, numNf: string) {
       const receiptDb = await this.model.findById(id)

       const inicioRecebimento = new Date().getTime()
       const tempoChegada = receiptDb?.dataChegada ? new Date(receiptDb.dataChegada).getTime() : 0

       const tempoEspera = inicioRecebimento > 0 ? Math.floor((inicioRecebimento - tempoChegada) / 60000): 0
       
        return await this.model.findByIdAndUpdate(id, {
            pesoNota: pesoNotaDto,
            notaFiscal: numNf,
            status: "Conferindo",
            dataInicio: inicioRecebimento,
            tempoEsperaMin: tempoEspera
        }, {new: true})
    }

    // finaliza um recebimento
    async finishReceipt(id : string, receipt: FinishReceipt){
        const receiptDb = await this.model.findById(id)

        const recebimentoFim = new Date()

        // passando as props date para getTime()
        const chegadaTempo = receiptDb?.dataChegada ? new Date(receiptDb.dataChegada).getTime() : 0
        const inicioTempo = receiptDb?.dataInicio ? new Date(receiptDb.dataInicio).getTime() : 0
        const finalTempo = recebimentoFim.getTime()

        const tempoPermanencia = chegadaTempo > 0 ? Math.floor((finalTempo - chegadaTempo) / 60000) : 0;
        const tempoExecucao = inicioTempo > 0 ? Math.floor((finalTempo - inicioTempo) / 60000) : 0;

        let statusReceipt = receipt.status
        const pesoNota = receiptDb?.pesoNota

        if(receipt.pesoBalanca >= pesoNota!){
            statusReceipt = "Finalizado"
        }else{
            statusReceipt = "Divergencia"
        }

        return await this.model.findByIdAndUpdate(id, {
            ...receipt,
            status: statusReceipt,
            dataFim: recebimentoFim,
            tempoExecucaoMin: tempoExecucao,
            tempoPermanenciaMin: tempoPermanencia
        }, {new: true})

    }
}