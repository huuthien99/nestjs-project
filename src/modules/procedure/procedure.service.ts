import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Procedure, ProcedureDocument } from './schemas/procedure.schema';
import { ProcedureDto } from './dto/procedure.dto';

@Injectable()
export class ProcedureService {
  constructor(
    @InjectModel(Procedure.name)
    private procedureModel: Model<ProcedureDocument>,
  ) {}

  async getAll() {
    return this.procedureModel.find().populate('createdBy', 'name');
  }

  async create(procedureDto: ProcedureDto, user: any) {
    try {
      const { name } = procedureDto;
      const exist = await this.procedureModel.findOne({ name });
      if (exist) throw new BadRequestException('Procedure name already exists');

      const data = {
        ...procedureDto,
        createdBy: user.userId,
      };

      const newProcedure = new this.procedureModel(data);
      await newProcedure.save();

      return {
        message: 'Create success',
        data: newProcedure,
      };
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Error creating procedure',
      );
    }
  }

  async update(id: string, data: { name: string }) {
    try {
      if (!id) throw new BadRequestException('Id is required');
      const newData = {
        ...data,
        updatedAt: new Date(),
      };
      const update = await this.procedureModel.findByIdAndUpdate(id, newData, {
        new: true,
      });
      return {
        message: 'Update Success',
        data: update,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Error');
    }
  }

  async remove(id: string) {
    try {
      if (!id) throw new BadRequestException('Id is required');
      const deleted = await this.procedureModel.findByIdAndDelete(id);

      if (!deleted) {
        throw new NotFoundException('Procedure not found');
      }

      return {
        message: 'Delete success',
        data: deleted,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Error');
    }
  }

  async getById(id: string) {
    try {
      if (!id) throw new BadRequestException('Id is required');
      const dataById = await this.procedureModel
        .findById(id)
        .populate('createdBy', 'name email');
      if (!dataById) throw new NotFoundException('Procedure not found');
      return {
        message: 'Success',
        data: dataById,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Error');
    }
  }
}
