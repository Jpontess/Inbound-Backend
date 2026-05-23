import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UserCreateDto } from './interface/userCreateDto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(createDto: UserCreateDto): Promise<User> {
    return this.userModel.create(createDto);
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email: email });
  }
}
