import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Supplier as SupplierModel,
  SupplierDocument,
} from './Schemas/suppliers.schema';
import { createSupplierDTO } from './dto/createSupplier.dto';
import { updateSupplierDTO } from './dto/updateSupplier.dto';
import { Supplier } from './interfaces/supplier.interface';
import { modelToSupplier } from './mappers/supplier.mapper';

@Injectable()
export class SupplierRepository {
  constructor(
    @InjectModel(SupplierModel.name)
    private readonly supplierModel: Model<SupplierDocument>,
  ) {}

  // Criar um novo fornecedor
  async create(supplierCreate: createSupplierDTO): Promise<Supplier> {
    const newSupplier = new this.supplierModel({
      ...supplierCreate,
      supplier_status: true,
    });

    const savedSupplier = await newSupplier.save();
    return modelToSupplier(savedSupplier);
  }
  // Listar todos os fornecedores
  async findAll(): Promise<Supplier[]> {
    const suppliers = await this.supplierModel
      .find()
      .select('-createdAt -updatedAt -__v');

    return suppliers.map((supplier) => modelToSupplier(supplier));
  }
  // Buscar fornecedor por Id
  async findById(id: string): Promise<Supplier | null> {
    const supplier = await this.supplierModel
      .findById(id)
      .select('-createdAt -updatedAt -__v');

    if (!supplier) {
      return null;
    }

    return modelToSupplier(supplier);
  }

  // Atualizar um fornecedor por Id
  async updateById(
    id: string,
    supplierUpdate: updateSupplierDTO,
  ): Promise<Supplier | null> {
    const supplier = await this.supplierModel.findByIdAndUpdate(
      id,
      supplierUpdate,
      {
        new: true,
      },
    );

    if (!supplier) {
      return null;
    }

    return modelToSupplier(supplier);
  }

  // Deletar um fornecedor por Id
  async softDeleteById(id: string): Promise<Supplier | null> {
    const supplier = await this.supplierModel.findByIdAndUpdate(
      id,
      { supplier_status: false },
      { new: true },
    );

    if (!supplier) return null;

    return modelToSupplier(supplier);
  }
}
