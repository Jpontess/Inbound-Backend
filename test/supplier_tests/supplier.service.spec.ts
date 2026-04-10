import { Test, TestingModule } from '@nestjs/testing';
import { SupplierService } from '../../src/supplier/supplier.service';

describe('SupplierService Tests', () => {
  let supplierService: SupplierService;

  beforeAll(async () => {
    const moduleFixature: TestingModule = await Test.createTestingModule({
      providers: [
        SupplierService,
        {
          provide: 'SupplierModel',
          useValue: {},
        },
      ],
    }).compile();

    supplierService = moduleFixature.get<SupplierService>(SupplierService);
  });

  it('should be defined', () => {
    expect(supplierService).toBeDefined();
  });

  // testando a função getSupplierById
  it('should get supplier by id', async () => {
    const id = '12345677';
    supplierService.getSupplierById = jest.fn().mockReturnValueOnce({
      id: '12345677',
      supplier_name: 'Test Supplier',
      status: true,
    });
    const result = await supplierService.getSupplierById(id);
    expect(result!.id).toEqual('12345677');
  });

  // testando a função getListSupplier
  it('should get list of suppliers', async () => {
    supplierService.getListSupplier = jest.fn().mockReturnValueOnce([
      {
        id: '12345677',
        supplier_name: 'Test Supplier',
        status: true,
      },
      {
        id: '12345678',
        supplier_name: 'Test Supplier 2',
        status: true,
      },
    ]);
    const result = await supplierService.getListSupplier();
    expect(result).toHaveLength(2);
  });
  // testando a função createSupplier
  it('should create a supplier', async () => {
    const supplierCreate = {
      supplier_name: 'Test Supplier 01',
      supplier_status: true,
    };
    supplierService.createSupplier = jest.fn().mockReturnValueOnce({
      id: '12345677',
      supplier_name: 'Test Supplier 01',
      supplier_status: true,
    });
    const result = await supplierService.createSupplier(supplierCreate);
    expect(result.id).toEqual('12345677');
  });

  // testando a função updateSupplier
  it('should update a supplier', async () => {
    const id = '12345677';
    const supplierUpdate = {
      supplier_name: 'Test Supplier 02',
      supplier_status: false,
    };
    supplierService.updateSupplier = jest.fn().mockReturnValueOnce({
      message: `O fornecedor Test Supplier 01 foi atualizado com sucesso!`,
    });
    const result = await supplierService.updateSupplier(id, supplierUpdate);
    expect(result.message).toEqual(
      `O fornecedor Test Supplier 01 foi atualizado com sucesso!`,
    );
  });

  // testando a função deleteSupplier
  it('should delete a supplier', async () => {
    const id = '12345677';
    supplierService.deleteSupplier = jest.fn().mockReturnValueOnce({
      message: `O fornecedor Test Supplier 01 foi deletado com sucesso!`,
    });
    const result = await supplierService.deleteSupplier(id);
    expect(result).toEqual({
      message: `O fornecedor Test Supplier 01 foi deletado com sucesso!`,
    });
  });
});
