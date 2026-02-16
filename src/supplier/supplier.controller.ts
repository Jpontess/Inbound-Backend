import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { SupplierService } from "./supplier.service";
import { supplierDto } from "./supplier.dto";

@Controller('supplier')
export class SupplierController{
    constructor(private supllierService: SupplierService){}

    @Post()
    create(@Body() supplierNew : supplierDto){
        return this.supllierService.createSupplier(supplierNew)
    }

    @Get()
    async listSupplier(){
        return await this.supllierService.getListSupplier()
    }

    @Get(":id")
    async supplierById(@Param("id") id: string){
        return await this.supllierService.getSupplierById(id)
    }

    @Patch(":id")
    async updateSupplier(@Param("id") id: string, @Body() supplierUpdate:supplierDto){
        return await this.supllierService.updateSupplier(id , supplierUpdate)
    }

    @Delete(":id")
    async deleteSupplier(@Param("id") id: string) {
        return await this.supllierService.deleteSupllier(id)
    }
}