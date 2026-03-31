import { Module } from '@nestjs/common';
import { ForumAccountsModule } from '@modules/forum-accounts/forum-accounts.module';
import { UsersModule } from '@users/users.module';
import { BankingService } from './banking.service';
import { BankingController } from './banking.controller';

@Module({
  imports: [
    ForumAccountsModule, // exports ForumAccountsService
    UsersModule, // exports UsersService
  ],
  providers: [BankingService],
  controllers: [BankingController],
})
export class BankingModule {}
