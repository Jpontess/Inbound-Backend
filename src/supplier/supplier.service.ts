import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { createSupplierDTO } from './dto/createSupplier.dto';
import { updateSupplierDTO } from './dto/updateSupplier.dto';
import { SupplierRepository } from './supplier.repository';

@Injectable()
export class SupplierService {
  private readonly logger = new Logger(SupplierService.name);

  constructor(private readonly supplierRepository: SupplierRepository) {}

  private getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }

  async createSupplier(supplierCreate: createSupplierDTO) {
    try {
      const newSupplier = await this.supplierRepository.create(supplierCreate);

      if (!newSupplier) {
        throw new InternalServerErrorException('Erro ao criar fornecedor');
      }

      this.logger.log(`Supplier ${newSupplier.id} created`);
      return newSupplier;
    } catch (error) {
      this.logger.error(
        `Failed to create supplier`,
        this.getErrorMessage(error),
      );
      throw new InternalServerErrorException('Erro ao criar fornecedor');
    }
  }

  async getListSupplier() {
    try {
      return await this.supplierRepository.findAll();
    } catch (error) {
      this.logger.error(
        `Failed to list suppliers`,
        this.getErrorMessage(error),
      );
      throw new InternalServerErrorException(
        'Erro ao buscar lista de fornecedores',
      );
    }
  }

  async getSupplierById(id: string) {
    try {
      const supplier = await this.supplierRepository.findById(id);

      if (!supplier) {
        throw new NotFoundException('Fornecedor nao encontrado');
      }

      return supplier;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to get supplier with id ${id}`,
        this.getErrorMessage(error),
      );
      throw new InternalServerErrorException('Erro ao buscar fornecedor');
    }
  }

  async updateSupplier(id: string, supplierUpdate: updateSupplierDTO) {
    try {
      const updatedSupplier = await this.supplierRepository.updateById(
        id,
        supplierUpdate,
      );

      if (!updatedSupplier) {
        throw new NotFoundException('Fornecedor nao encontrado');
      }

      this.logger.log(`Supplier updated with id ${id}`);
      return {
        message: `Fornecedor atualizado com sucesso!`,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to update supplier with id ${id}`,
        this.getErrorMessage(error),
      );
      throw new InternalServerErrorException('Erro ao atualizar fornecedor');
    }
  }

  async deleteSupplier(id: string) {
    try {
      const deletedSupplier = await this.supplierRepository.softDeleteById(id);

      if (!deletedSupplier) {
        throw new NotFoundException('Fornecedor nao encontrado');
      }

      this.logger.log(`Supplier deleted with id ${id}`);
      return {
        message: `O fornecedor ${deletedSupplier.supplier_name} foi deletado com sucesso!`,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to delete supplier with id ${id}`,
        this.getErrorMessage(error),
      );
      throw new InternalServerErrorException('Erro ao deletar fornecedor');
    }
  }
}
