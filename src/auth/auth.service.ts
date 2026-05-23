import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserCreateDto } from '../users/interface/userCreateDto';
import { UserRepository } from '../users/user.repository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly repository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async singIn(email: string, password: string) {
    const userExist = await this.repository.findByEmail(email);

    if (!userExist) {
      throw new UnauthorizedException('User invalid');
    }

    const isMath = await bcrypt.compare(password, userExist.password);

    if (!isMath) {
      throw new UnauthorizedException('password invalid');
    }
    const payload = {
      name: userExist.name,
      email: userExist.email,
      roles: [userExist.roles],
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    return {
      token: token,
    };
  }
  async register(createUser: UserCreateDto) {
    const hash = await this.hash(createUser.password);

    const newUser: UserCreateDto = {
      ...createUser,
      password: hash,
    };
    return await this.repository.createUser(newUser);
  }

  async hash(password: string) {
    const hash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS!));
    return hash;
  }
}
