import { Test, TestingModule } from '@nestjs/testing';
import { describe, beforeEach, it, expect } from 'vitest';
import { TesterController } from './tester.controller';
import { TesterService } from './tester.service';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';

describe('TesterController', () => {
  let controller: TesterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TesterController],
      providers: [TesterService],
    })
      // Override JwtAuthGuard so tests don't need real JWT
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TesterController>(TesterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return value and uuid on submit', () => {
    const result = controller.submit({ value: 'hello' });
    expect(result.value).toBe('hello');
    expect(result.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });
});
