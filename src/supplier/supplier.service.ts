import { Body, Injectable, Param } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Supplier, SupplierDocument } from "./Schemas/suppliers.schema";
import { Model } from "mongoose";
import { supplierDto } from "../supplier/supplier.dto";

@Injectable()
export class SupplierService{
    constructor(@InjectModel(Supplier.name) private model: Model<SupplierDocument>) {}

    createSupplier(@Body() supplierCreate : supplierDto){
        const newSupplier = new this.model(supplierCreate)

        return newSupplier.save()
    }

    async getListSupplier(){

        return await this.model.find()
    }

    async getSupplierById(id: string){
        return await this.model.findById(id)
    }

    async updateSupplier(id : string, @Body() supplierUpdate: supplierDto){
        return await this.model.findByIdAndUpdate( id, supplierUpdate, {new: true})   
    }

    async deleteSupllier(id: string){
        return await this.model.findByIdAndDelete(id)
    }
}