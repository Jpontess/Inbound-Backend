import { Test, TestingModule } from '@nestjs/testing';
import { CreateReceiptDto } from './dto/createReceipt.dto';
import { UpdateReceiptDto } from './dto/updateReceipt.dto';
import { ReceiptService } from './receipt.service';
import { ReceiptInterface } from './interface/receipt.interface';
import { Logger } from '@nestjs/common';
import { Supplier } from 'src/supplier/interfaces/supplier.interface';
import { ReceiptRepository } from './receipt.repository';
import { SupplierRepository } from '../supplier/supplier.repository';

type MockRepository = {
  create: jest.Mock<Promise<ReceiptInterface | null>, [CreateReceiptDto]>;
  findAll: jest.Mock<Promise<ReceiptInterface[]>, []>;
  findById: jest.Mock<Promise<ReceiptInterface | null>, [string]>;
  update: jest.Mock<
    Promise<ReceiptInterface | null>,
    [string, UpdateReceiptDto]
  >;
  softDeleteById: jest.Mock<Promise<ReceiptInterface | null>, [string]>;
};

type MockSupplierRepository = {
  findById: jest.Mock<Promise<Supplier | null>, [string]>;
};

describe('ReceiptService', () => {
  let service: ReceiptService;
  let repository: MockRepository;
  let supplierRepository: MockSupplierRepository;

  const mockRepository: MockRepository = {
    create: jest.fn<Promise<ReceiptInterface | null>, [CreateReceiptDto]>(),
    findAll: jest.fn<Promise<ReceiptInterface[]>, []>(),
    findById: jest.fn<Promise<ReceiptInterface | null>, [string]>(),
    update: jest.fn<
      Promise<ReceiptInterface | null>,
      [string, UpdateReceiptDto]
    >(),
    softDeleteById: jest.fn<Promise<ReceiptInterface | null>, [string]>(),
  };

  const mockSupplierRepository: MockSupplierRepository = {
    findById: jest.fn<Promise<Supplier | null>, [string]>(),
  };

  beforeEach(async () => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReceiptService,
        { provide: ReceiptRepository, useValue: mockRepository },
        { provide: SupplierRepository, useValue: mockSupplierRepository },
      ],
    }).compile();

    service = module.get<ReceiptService>(ReceiptService);
    repository = module.get<MockRepository>(ReceiptRepository);
    supplierRepository = module.get<MockSupplierRepository>(SupplierRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Testes para createReceipt
  describe('createReceipt', () => {
    it('should create a receipt successfully', async () => {
      const dto: CreateReceiptDto = {
        supplier_id: 'supplier123',
        supplier_name: 'Test Supplier',
        arrival_date: new Date(),
        license_plate: 'ABC-1234',
        status: 'Aguardando',
      };

      const supplierDto: Supplier = {
        id: 'supplier123',
        supplier_name: 'Test Supplier',
        supplier_status: true,
      };

      const result: ReceiptInterface = {
        id: 'receipt123',
        supplier_name: supplierDto.supplier_name,
        license_plate: 'ABC-1234',
        arrival_date: dto.arrival_date,
        status: 'Aguardando',
      };

      const mockReceipt = {
        ...result,
        save: jest.fn().mockResolvedValue(result),
      };

      supplierRepository.findById.mockResolvedValue(supplierDto);
      repository.create.mockResolvedValue(mockReceipt);

      const response = await service.createReceipt(dto);

      expect(supplierRepository.findById).toHaveBeenCalledWith('supplier123');
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          supplier_id: 'supplier123',
          supplier_name: 'Test Supplier',
          license_plate: 'ABC-1234',
          status: 'Aguardando',
        }),
      );
      expect(response).toEqual(result);
    });

    it('should throw an error if supplier is not found', async () => {
      const dto: CreateReceiptDto = {
        supplier_id: 'nonexistent_supplier',
        supplier_name: 'Nonexistent Supplier',
        arrival_date: new Date(),
        license_plate: 'XYZ-5678',
        status: 'Aguardando',
      };

      supplierRepository.findById.mockResolvedValue(null);

      await expect(service.createReceipt(dto)).rejects.toThrow(
        'Supplier not found',
      );
      expect(supplierRepository.findById).toHaveBeenCalledWith(
        'nonexistent_supplier',
      );
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('CreateSchedule', () => {
    it('should return all scheduled receipts', async () => {
      const result: ReceiptInterface[] = [
        {
          supplier_id: 'supplier123',
          supplier_name: 'Test Supplier',
          supplier_status: true,
          invoice_weight: 100,
          scheduling_date: new Date('2024-06-01T10:00:00Z'),
          status: 'Agendado',
        },
      ];

      repository.findAll.mockResolvedValue(result);

      const response = await service.listReceipt();

      expect(repository.findAll).toHaveBeenCalled();
      expect(response).toEqual(result);
    });
    it('should return an empty array if no scheduled receipts are found', async () => {
      repository.findAll.mockResolvedValue([]);

      const response = await service.listReceipt();

      expect(repository.findAll).toHaveBeenCalled();
      expect(response).toEqual([]);
    });
  });

  describe('ListReceipt', () => {
    it('should return all receipts', async () => {
      const result: ReceiptInterface[] = [
        {
          supplier_id: 'supplier123',
          supplier_name: 'Test Supplier',
          supplier_status: true,
          invoice_weight: 100,
          scheduling_date: new Date('2024-06-01T10:00:00Z'),
          status: 'Agendado',
        },
        {
          supplier_id: 'supplier456',
          supplier_name: 'Test Supplier',
          supplier_status: true,
          invoice_weight: 100,
          scheduling_date: new Date('2024-06-01T10:00:00Z'),
          status: 'Agendado',
        },
        {
          supplier_id: 'supplier789',
          supplier_name: 'Another Supplier',
          supplier_status: true,
          invoice_weight: 200,
          scheduling_date: new Date('2024-06-02T10:00:00Z'),
          status: 'Agendado',
        },
      ];

      repository.findAll.mockResolvedValue(result);

      const response = await service.listReceipt();

      expect(repository.findAll).toHaveBeenCalled();
      expect(response).toEqual(result);
    });

    it('should return an empty array if no receipts are found', async () => {
      repository.findAll.mockResolvedValue([]);
      const response = await service.listReceipt();
      expect(repository.findAll).toHaveBeenCalled();
      expect(response).toEqual([]);
    });
  });

  describe('receiptById', () => {
    it('should return a receipt by ID', async () => {
      const result: ReceiptInterface = {
        supplier_id: 'supplier123',
        supplier_name: 'Test Supplier',
        supplier_status: true,
        invoice_weight: 100,
        scheduling_date: new Date('2024-06-01T10:00:00Z'),
        status: 'Agendado',
      };

      repository.findById.mockResolvedValue(result);

      const response = await service.receiptById('test-id');

      expect(repository.findById).toHaveBeenCalledWith('test-id');
      expect(response).toEqual(result);
    });

    it('should return null if receipt is not found', async () => {
      repository.findById.mockResolvedValue(null);
      const response = await service.receiptById('nonexistent-id');
      expect(repository.findById).toHaveBeenCalledWith('nonexistent-id');
      expect(response).toBeNull();
    });
  });

  describe('updateReceipt', () => {
    it('should update a receipt by ID', async () => {
      const updateDto: UpdateReceiptDto = {
        license_plate: 'UPDATED-1234',
        status: 'Conferindo',
        invoice_number: 'INV-5678',
        scale_weight: 150,
        notes: 'Updated notes',
      };

      const result: ReceiptInterface = {
        supplier_id: 'supplier123',
        supplier_name: 'Test Supplier',
        supplier_status: true,
        invoice_weight: 100,
        scheduling_date: new Date('2024-06-01T10:00:00Z'),
        status: 'Agendado',
      };

      repository.update.mockResolvedValue(result);

      const response = await service.updateReceipt('test-id', updateDto);

      expect(repository.update).toHaveBeenCalledWith('test-id', updateDto);
      expect(response).toEqual(result);
    });

    it('should return an error if receipt is not found', async () => {
      const updateDto: UpdateReceiptDto = {
        license_plate: 'UPDATED-1234',
        status: 'Conferindo',
        invoice_number: 'INV-5678',
        scale_weight: 150,
        notes: 'Updated notes',
      };
      repository.update.mockResolvedValue(null);
      await expect(
        service.updateReceipt('nonexistent-id', updateDto),
      ).rejects.toThrow('Receipt not found');
      expect(repository.update).toHaveBeenCalledWith(
        'nonexistent-id',
        updateDto,
      );
    });
  });

  //   describe('deleteReceipt', () => {
  //     it('should delete a receipt by ID', async () => {});
  //   });

  describe('startReceipt', () => {
    it('should start a receipt by ID', async () => {
      const result: ReceiptInterface = {
        supplier_id: 'supplier123',
        supplier_name: 'Test Supplier',
        supplier_status: true,
        invoice_number: 'INV-5678',
        invoice_weight: 100,
        scheduling_date: new Date('2024-06-01T10:00:00Z'),
        status: 'Aguardando',
      };

      repository.findById.mockResolvedValue({
        ...result,
        arrival_date: new Date('2024-06-01T10:00:00Z'),
      });
      repository.update.mockResolvedValue(result);

      const response = await service.startReceipt('test-id', {
        invoice_number: 'INV-5678',
        invoice_weight: 100,
        user_name: 'Test User',
      });
      expect(repository.update).toHaveBeenLastCalledWith('test-id', {
        invoice_number: 'INV-5678',
        invoice_weight: 100,
        user_name: 'Test User',
        status: 'Conferindo',
        start_date: expect.any(Number) as unknown as number,
        wait_time_min: expect.any(Number) as unknown as number,
      });

      expect(response).toEqual(result);
    });
  });

  describe('finishReceipt', () => {
    it('should finish a receipt by ID', async () => {
      const result: ReceiptInterface = {
        supplier_id: 'supplier123',
        supplier_name: 'Test Supplier',
        supplier_status: true,
        invoice_number: 'INV-5678',
        invoice_weight: 100,
        scheduling_date: new Date('2024-06-01T10:00:00Z'),
        status: 'Conferindo',
      };

      repository.findById.mockResolvedValue({
        ...result,
        arrival_date: new Date('2024-06-01T10:00:00Z'),
        start_date: new Date('2024-06-01T11:00:00Z'),
      });
      repository.update.mockResolvedValue({
        ...result,
        status: 'Finalizado',
      });

      const response = await service.finishReceipt('test-id', {
        scale_weight: 100,
        notes: 'Finished notes',
      });

      expect(repository.update).toHaveBeenLastCalledWith('test-id', {
        scale_weight: 100,
        notes: 'Finished notes',
        status: 'Finalizado',
        end_date: expect.any(Date) as unknown as Date,
        execution_time_min: expect.any(Number) as unknown as number,
        stay_time_min: expect.any(Number) as unknown as number,
      });
      expect(response).toEqual({
        ...result,
        status: 'Finalizado',
      });
    });
  });
});
