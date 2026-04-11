import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { createSupplierDTO } from './dto/createSupplier.dto';
import { updateSupplierDTO } from './dto/updateSupplier.dto';

@Controller('supplier')
export class SupplierController {
  constructor(private supplierService: SupplierService) {}

  @Post()
  create(@Body() supplierNew: createSupplierDTO) {
    return this.supplierService.createSupplier(supplierNew);
  }

  @Get()
  async listSupplier() {
    return this.supplierService.getListSupplier();
  }

  @Get(':id')
  async supplierById(@Param('id') id: string) {
    return this.supplierService.getSupplierById(id);
  }

  @Patch('update/:id')
  async updateSupplier(
    @Param('id') id: string,
    @Body() supplierUpdate: updateSupplierDTO,
  ) {
    return this.supplierService.updateSupplier(id, supplierUpdate);
  }

  @Delete('delete/:id')
  async deleteSupplier(@Param('id') id: string) {
    return this.supplierService.deleteSupplier(id);
  }
}
