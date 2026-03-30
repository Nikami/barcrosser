import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BankingService } from './banking.service';

interface AuthRequest extends Express.Request {
  user: { sub: string; username: string };
}

interface RunBankingDto {
  sinceDate: string; // ISO date string e.g. "2025-01-01"
}

@UseGuards(AuthGuard('jwt'))
@Controller('banking')
export class BankingController {
  constructor(private readonly banking: BankingService) {}

  /**
   * POST /banking/run
   * Body: { sinceDate: "YYYY-MM-DD" }
   * Triggers banking run for the authenticated user.
   */
  @Post('run')
  run(@Request() req: AuthRequest, @Body() body: RunBankingDto) {
    const sinceDate = body.sinceDate ? new Date(body.sinceDate) : new Date(0);
    return this.banking.run(req.user.sub, sinceDate);
  }
}
