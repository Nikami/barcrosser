// server/src/modules/forum-accounts/schemas/forum-account.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ForumAccountDocument = ForumAccount & Document;

@Schema({ timestamps: true })
export class ForumAccount {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string; // имя персонажа на форуме

  // зашифрованный пароль, хранится как поддокумент
  @Prop({ required: true })
  password: {
    iv: string;
    authTag: string;
    data: string;
  };

  @Prop({ default: true })
  isActive: boolean;
}

export const ForumAccountSchema = SchemaFactory.createForClass(ForumAccount);

// уникальный индекс: один пользователь – один аккаунт с данным именем
ForumAccountSchema.index({ userId: 1, name: 1 }, { unique: true });
