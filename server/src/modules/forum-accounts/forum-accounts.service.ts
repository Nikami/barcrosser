import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ForumAccountDto, UpsertForumAccountDto } from '@barcrosser/shared';
import { CryptoService, EncryptedPayload } from '@common/crypto.service';
import {
  ForumAccount,
  ForumAccountDocument,
} from './schemas/forum-account.schema';

@Injectable()
export class ForumAccountsService {
  constructor(
    @InjectModel(ForumAccount.name)
    private readonly accountModel: Model<ForumAccountDocument>,
    private readonly crypto: CryptoService,
  ) {}

  // ---------- UPSERT (create or update by name) ----------
  async upsert(
    userId: string,
    dto: UpsertForumAccountDto,
  ): Promise<ForumAccountDto> {
    const encrypted: EncryptedPayload = this.crypto.encrypt(dto.password);
    const existing = await this.accountModel.findOne({
      userId: new Types.ObjectId(userId),
      name: dto.name,
    });

    if (existing) {
      existing.password = encrypted;
      await existing.save();
      return this.toDto(existing);
    }

    try {
      const created = await this.accountModel.create({
        userId: new Types.ObjectId(userId),
        name: dto.name,
        password: encrypted,
      });
      return this.toDto(created);
    } catch (err: unknown) {
      if (this.isDuplicateKeyError(err)) {
        throw new BadRequestException(
          `Forum account "${dto.name}" already exists for this user.`,
        );
      }
      throw err;
    }
  }

  // ---------- READ ----------
  async findAll(userId: string): Promise<ForumAccountDto[]> {
    const accounts = await this.accountModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 });
    return accounts.map((acc) => this.toDto(acc));
  }

  async findOneOrFail(
    userId: string,
    id: string,
  ): Promise<ForumAccountDocument> {
    const acc = await this.accountModel.findOne({
      _id: id,
      userId: new Types.ObjectId(userId),
    });
    if (!acc) throw new NotFoundException(`Forum account not found: ${id}`);
    return acc;
  }

  // ---------- UPDATE by id ----------
  async update(
    userId: string,
    id: string,
    dto: UpsertForumAccountDto,
  ): Promise<ForumAccountDto> {
    const acc = await this.findOneOrFail(userId, id);
    acc.name = dto.name;
    if (dto.password) {
      acc.password = this.crypto.encrypt(dto.password);
    }
    await acc.save();
    return this.toDto(acc);
  }

  // ---------- DELETE ----------
  async remove(userId: string, id: string): Promise<void> {
    const result = await this.accountModel.deleteOne({
      _id: id,
      userId: new Types.ObjectId(userId),
    });
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Forum account not found: ${id}`);
    }
  }

  // ---------- TOGGLE ACTIVE ----------
  async toggleActive(userId: string, id: string): Promise<ForumAccountDto> {
    const acc = await this.findOneOrFail(userId, id);
    acc.isActive = !acc.isActive;
    await acc.save();
    return this.toDto(acc);
  }

  // ---------- FOR BANKING: active accounts with decrypted passwords ----------
  async getDecryptedAccounts(
    userId: string,
  ): Promise<Array<{ name: string; password: string }>> {
    const accounts = await this.accountModel.find({
      userId: new Types.ObjectId(userId),
      isActive: true,
    });
    return accounts.map((acc) => ({
      name: acc.name,
      password: this.crypto.decrypt(acc.password),
    }));
  }

  // ---------- HELPERS ----------
  private toDto(acc: ForumAccountDocument): ForumAccountDto {
    const doc = acc.toObject<
      ForumAccount & { _id: Types.ObjectId; createdAt: Date; updatedAt: Date }
    >();
    return {
      id: doc._id.toString(),
      name: doc.name,
      isActive: doc.isActive,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    };
  }

  private isDuplicateKeyError(err: unknown): boolean {
    return (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code: number }).code === 11000
    );
  }
}
