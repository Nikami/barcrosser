import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import type { TesterResponse } from '@barcrosser/shared';
import { TesterService } from './tester.service';
import { TesterDto } from './dto/tester.dto';

@Controller('tester')
export class TesterController {
  constructor(private readonly testerService: TesterService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  submit(@Body() dto: TesterDto): TesterResponse {
    return this.testerService.submit(dto);
  }
}
