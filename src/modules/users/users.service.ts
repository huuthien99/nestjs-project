import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(data: RegisterDto) {
    const newUser = new this.userModel(data);
    return newUser.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async getMe(payload: { email: string; userId: string }) {
    try {
      const user = await this.findByEmail(payload.email);
      if (!user) throw new UnauthorizedException('User not found');
      const plainUser = user.toObject();
      const { password, ...result } = plainUser;
      return {
        message: 'Get me success',
        user: result,
      };
    } catch (error) {
      throw new UnauthorizedException('Get me failed');
    }
  }
}
