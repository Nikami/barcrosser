import { Injectable, Logger } from '@nestjs/common';
import { ForumAccountsService } from '@modules/forum-accounts/forum-accounts.service';
import { UsersService } from '@users/users.service';

@Injectable()
export class BankingService {
  private readonly logger = new Logger(BankingService.name);

  constructor(
    private readonly forumAccounts: ForumAccountsService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Run the banking process for the given user.
   * Retrieves all active forum accounts with decrypted passwords,
   * performs the scraping workflow (placeholder), and updates lastBankingDate.
   */
  async run(userId: string, sinceDate: Date): Promise<{ message: string }> {
    const accounts = await this.forumAccounts.getDecryptedAccounts(userId);

    if (accounts.length === 0) {
      return { message: 'No active forum accounts found.' };
    }

    this.logger.log(
      `Starting banking run for user ${userId} with ${accounts.length} account(s), since ${sinceDate.toISOString()}`,
    );

    // ---------------------------------------------------------------
    // TODO: replace this placeholder with actual scraping logic using
    // axios + cheerio to call:
    //   https://barcross.ru/search.php?action=search&author=<name>
    //   &forums=10&search_in=0&sort_by=0&sort_dir=DESC&show_as=posts
    // for each account, login with credentials, paginate results,
    // count characters per post, and persist the results.
    // ---------------------------------------------------------------
    for (const { name } of accounts) {
      this.logger.debug(`Processing account: ${name}`);
    }

    await this.usersService.updateLastBankingDate(userId, new Date());

    return {
      message: `Banking run completed for ${accounts.length} account(s).`,
    };
  }
}
