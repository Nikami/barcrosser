import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username: username.toLowerCase() }).exec();
  }

  async createUser(username: string, password: string): Promise<UserDocument> {
    const hash = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      username: username.toLowerCase(),
      password: hash,
    });
    return user.save();
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async count(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }

  /**
   * Seed: if no users exist, create default test user.
   * Called once on app startup from AuthModule.
   */
  async seedDefaultUser(): Promise<void> {
    const existing = await this.count();
    if (existing === 0) {
      await this.createUser('testuser', 'testpass123');
      console.log('🌱 Seeded default user: testuser / testpass123');
    }
  }
}
