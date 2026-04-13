import { SupplierDocument } from '../Schemas/suppliers.schema';
import { Supplier } from '../interfaces/supplier.interface';

export function modelToSupplier(supplier: SupplierDocument): Supplier {
  return {
    id: supplier.id,
    supplier_name: supplier.supplier_name,
    supplier_status: supplier.supplier_status,
  };
}
