import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, ...rest } = registerDto;
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.usersService.create({
        ...rest,
        email,
        password: hashedPassword,
      });
      const payload = { sub: user._id, email: user.email };
      return {
        message: 'User registered successfully',
        access_token: this.jwtService.sign(payload),
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          phone: user.phone,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to create user');
    }
  }
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    try {
      const user = await this.usersService.findByEmail(email);

      if (!user) throw new UnauthorizedException('User not found');

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid)
        throw new UnauthorizedException('Invalid credentials');

      const payload = { sub: user._id, email: user.email };
      return {
        message: 'Login successful',
        access_token: this.jwtService.sign(payload),
        user: {
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
        },
      };
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Login failed');
    }
  }
}
