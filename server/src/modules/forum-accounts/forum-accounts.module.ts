import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ForumAccount, ForumAccountSchema } from './schemas/forum-account.schema';
import { ForumAccountsService } from './forum-accounts.service';
import { ForumAccountsController } from './forum-accounts.controller';
import { CryptoService } from '@common/crypto.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ForumAccount.name, schema: ForumAccountSchema },
    ]),
  ],
  providers: [ForumAccountsService, CryptoService],
  controllers: [ForumAccountsController],
  exports: [ForumAccountsService],
})
export class ForumAccountsModule {}
