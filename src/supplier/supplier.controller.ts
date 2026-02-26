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
  constructor(private supllierService: SupplierService) {}

  @Post()
  create(@Body() supplierNew: createSupplierDTO) {
    return this.supllierService.createSupplier(supplierNew);
  }

  @Get()
  async listSupplier() {
    return await this.supllierService.getListSupplier();
  }

  @Get(':id')
  async supplierById(@Param('id') id: string) {
    return await this.supllierService.getSupplierById(id);
  }

  @Patch('update/:id')
  async updateSupplier(
    @Param('id') id: string,
    @Body() supplierUpdate: updateSupplierDTO,
  ) {
    return await this.supllierService.updateSupplier(id, supplierUpdate);
  }

  @Delete('delete/:id')
  async deleteSupplier(@Param('id') id: string) {
    return await this.supllierService.deleteSupllier(id);
  }
}
