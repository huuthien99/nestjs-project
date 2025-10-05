import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProcedureService } from './procedure.service';
import { ProcedureDto } from './dto/procedure.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('procedure')
export class ProcedureController {
  constructor(private readonly procedureService: ProcedureService) {}
  @Get()
  getAll() {
    return this.procedureService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() procedureDto: ProcedureDto, @Request() req) {
    return this.procedureService.create(procedureDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.procedureService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: { name: string }) {
    return this.procedureService.update(id, data);
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.procedureService.getById(id);
  }
}
