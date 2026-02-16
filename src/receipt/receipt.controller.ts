import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ReceiptService } from "./receipt.service";
import { CreateReceiptDto } from "./ReceiptDTO/createReceipt.dto";
import { UpdateReceiptDto } from "./ReceiptDTO/updateReceipt.dto";
import { FinishReceipt } from "./ReceiptDTO/finishReceipt.dto";

@Controller("receipt")
export class ReceiptController{
    constructor(private service: ReceiptService ){}

    @Post()
    create(@Body() newReceipt: CreateReceiptDto){
        return this.service.createReceipt(newReceipt)
    }

    @Get()
    async listReceipt(){
        return await this.service.listReceipt()
    }

    @Get(":id")
    async receiptById(@Param("id") id: string){
        return await this.service.receiptById(id)
    }

    @Patch(":id")
    async updateReceipt(@Param("id") id: string, @Body() updateNew: CreateReceiptDto){
        return await this.service.updateReceipt(id, updateNew)
    }

    @Delete(":id")
    async deleteReceipt(@Param("id") id: string){
        return await this.service.deleteReceipt(id);
    }

    @Post(":id")
    async startReceipt(@Param("id") id: string, @Body() receipt : UpdateReceiptDto ) {
        return await this.service.startReceipt(id, receipt.pesoNota!, receipt.notaFiscal!)
    }

    // finalizar Recebimento
    @Post("finish/:id")
    async finishReceipt(@Param("id")id : string, @Body() receipt: FinishReceipt) {
        return await this.service.finishReceipt(id, receipt)
    }
}