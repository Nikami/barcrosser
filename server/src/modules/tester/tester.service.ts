import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { TesterResponse } from '@barcrosser/shared';
import { TesterDto } from './dto/tester.dto';

@Injectable()
export class TesterService {
  submit(dto: TesterDto): TesterResponse {
    return {
      value: dto.value,
      id: randomUUID(),
    };
  }
}
