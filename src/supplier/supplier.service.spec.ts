import { Test, TestingModule } from '@nestjs/testing';
import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { SupplierService } from './supplier.service';
import { SupplierRepository } from './supplier.repository';
import { Supplier } from './interfaces/supplier.interface';
import { createSupplierDTO } from './dto/createSupplier.dto';
import { updateSupplierDTO } from './dto/updateSupplier.dto';

type MockRepository = {
  create: jest.Mock<Promise<Supplier | null>, [createSupplierDTO]>;
  findAll: jest.Mock<Promise<Supplier[]>, []>;
  findById: jest.Mock<Promise<Supplier | null>, [string]>;
  updateById: jest.Mock<Promise<Supplier | null>, [string, updateSupplierDTO]>;
  softDeleteById: jest.Mock<Promise<Supplier | null>, [string]>;
};

describe('SupplierService', () => {
  let service: SupplierService;
  let repository: MockRepository;

  const mockRepository: MockRepository = {
    create: jest.fn<Promise<Supplier | null>, [createSupplierDTO]>(),
    findAll: jest.fn<Promise<Supplier[]>, []>(),
    findById: jest.fn<Promise<Supplier | null>, [string]>(),
    updateById: jest.fn<
      Promise<Supplier | null>,
      [string, updateSupplierDTO]
    >(),
    softDeleteById: jest.fn<Promise<Supplier | null>, [string]>(),
  };

  beforeEach(async () => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupplierService,
        {
          provide: SupplierRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SupplierService>(SupplierService);
    repository = module.get(SupplierRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createSupplier', () => {
    it('should create a supplier successfully', async () => {
      const dto: createSupplierDTO = {
        supplier_name: 'Teste',
        supplier_status: true,
      };
      const result: Supplier = {
        id: '1',
        supplier_name: 'Teste',
        supplier_status: true,
      };

      repository.create.mockResolvedValue(result);

      const response = await service.createSupplier(dto);

      expect(response).toEqual(result);
      expect(repository.create).toHaveBeenCalledWith(dto);
    });

    it('should throw InternalServerErrorException when repository returns null', async () => {
      const dto: createSupplierDTO = {
        supplier_name: 'Teste',
        supplier_status: true,
      };

      repository.create.mockResolvedValue(null);

      await expect(service.createSupplier(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw InternalServerErrorException when repository throws', async () => {
      const dto: createSupplierDTO = {
        supplier_name: 'Teste',
        supplier_status: true,
      };

      repository.create.mockRejectedValue(new Error());

      await expect(service.createSupplier(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getListSupplier', () => {
    it('should return list of suppliers', async () => {
      const result: Supplier[] = [
        {
          id: '1',
          supplier_name: 'Teste',
          supplier_status: true,
        },
      ];

      repository.findAll.mockResolvedValue(result);

      const response = await service.getListSupplier();

      expect(response).toEqual(result);
    });

    it('should throw InternalServerErrorException when fails', async () => {
      repository.findAll.mockRejectedValue(new Error());

      await expect(service.getListSupplier()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getSupplierById', () => {
    it('should return supplier when found', async () => {
      const result: Supplier = {
        id: '1',
        supplier_name: 'Teste',
        supplier_status: true,
      };

      repository.findById.mockResolvedValue(result);

      const response = await service.getSupplierById('1');

      expect(response).toEqual(result);
      expect(repository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.getSupplierById('1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException when repository fails', async () => {
      repository.findById.mockRejectedValue(new Error());

      await expect(service.getSupplierById('1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('updateSupplier', () => {
    it('should update supplier successfully', async () => {
      const result: Supplier = {
        id: '1',
        supplier_name: 'Teste',
        supplier_status: true,
      };
      const dto: updateSupplierDTO = {
        supplier_name: 'Atualizado',
      };

      repository.updateById.mockResolvedValue(result);

      const response = await service.updateSupplier('1', dto);

      expect(response).toEqual({
        message: 'Fornecedor atualizado com sucesso!',
      });
      expect(repository.updateById).toHaveBeenCalledWith('1', dto);
    });

    it('should throw NotFoundException when supplier not found', async () => {
      const dto: updateSupplierDTO = {
        supplier_name: 'Atualizado',
      };

      repository.updateById.mockResolvedValue(null);

      await expect(service.updateSupplier('1', dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException when update fails', async () => {
      const dto: updateSupplierDTO = {
        supplier_name: 'Atualizado',
      };

      repository.updateById.mockRejectedValue(new Error());

      await expect(service.updateSupplier('1', dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('deleteSupplier', () => {
    it('should delete supplier successfully', async () => {
      const result: Supplier = {
        id: '1',
        supplier_name: 'Teste',
        supplier_status: false,
      };

      repository.softDeleteById.mockResolvedValue(result);

      const response = await service.deleteSupplier('1');

      expect(response).toEqual({
        message: 'O fornecedor Teste foi deletado com sucesso!',
      });
      expect(repository.softDeleteById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when supplier not found', async () => {
      repository.softDeleteById.mockResolvedValue(null);

      await expect(service.deleteSupplier('1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException when delete fails', async () => {
      repository.softDeleteById.mockRejectedValue(new Error());

      await expect(service.deleteSupplier('1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
