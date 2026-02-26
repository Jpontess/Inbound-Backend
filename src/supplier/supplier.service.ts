import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Supplier, SupplierDocument } from './Schemas/suppliers.schema';
import { Model } from 'mongoose';
import { createSupplierDTO } from './dto/createSupplier.dto';
import { updateSupplierDTO } from './dto/updateSupplier.dto';

@Injectable()
export class SupplierService {
  constructor(
    @InjectModel(Supplier.name) private model: Model<SupplierDocument>,
  ) {}

  createSupplier(supplierCreate: createSupplierDTO) {
    const newSupplier = new this.model({ ...supplierCreate, status: true });
    if (!newSupplier) {
      throw new Error('Erro ao criar fornecedor');
    }

    return newSupplier.save();
  }

  async getListSupplier() {
    return await this.model.find().select('-createdAt -updatedAt -__v');
  }

  async getSupplierById(id: string) {
    return await this.model.findById(id).select('-createdAt -updatedAt -__v');
  }

  async updateSupplier(id: string, supplierUpdate: updateSupplierDTO) {
    const updatedSupplier = await this.model.findByIdAndUpdate(
      id,
      supplierUpdate,
      { new: true },
    );
    if (!updatedSupplier) {
      throw new Error('Erro ao atualizar fornecedor');
    }
    return {
      message: `O fornecedor ${updatedSupplier.name} foi atualizado com sucesso!`,
    };
  }

  async deleteSupllier(id: string) {
    const deletedSupplier = await this.model.findByIdAndDelete(id);
    if (!deletedSupplier) {
      throw new Error('Erro ao deletar fornecedor');
    }
    return {
      message: `O fornecedor ${deletedSupplier.name} foi deletado com sucesso!`,
    };
  }
}
