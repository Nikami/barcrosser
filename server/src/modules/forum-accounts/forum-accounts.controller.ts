import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UpsertForumAccountDto } from '@barcrosser/shared';
import { ForumAccountsService } from './forum-accounts.service';

interface AuthRequest extends Express.Request {
  user: { sub: string; username: string };
}

@UseGuards(AuthGuard('jwt'))
@Controller('forum-accounts')
export class ForumAccountsController {
  constructor(private readonly service: ForumAccountsService) {}

  /** Create or update by name (upsert) */
  @Post()
  upsert(@Request() req: AuthRequest, @Body() dto: UpsertForumAccountDto) {
    return this.service.upsert(req.user.sub, dto);
  }

  /** List all accounts for the current user */
  @Get()
  findAll(@Request() req: AuthRequest) {
    return this.service.findAll(req.user.sub);
  }

  /** Update by id */
  @Patch(':id')
  update(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: UpsertForumAccountDto,
  ) {
    return this.service.update(req.user.sub, id, dto);
  }

  /** Toggle active flag */
  @Patch(':id/toggle')
  toggleActive(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.service.toggleActive(req.user.sub, id);
  }

  /** Delete by id */
  @Delete(':id')
  remove(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.service.remove(req.user.sub, id);
  }
}
