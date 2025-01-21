import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from './models/user.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private authModel: Model<UserDocument>) {}
  async createUser(email: string, password: string) {
    const createdUser = new this.authModel({ email, password });

    return await createdUser.save();
  }

  async findOneByEmail(email: string): Promise<UserDocument> {
    return await this.authModel.findOne({ email });
  }

  async findById(id: string): Promise<UserDocument> {
    return (await this.authModel.findById(id).lean()) as UserDocument;
  }
}
