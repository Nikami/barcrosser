import { IsString, IsNotEmpty } from 'class-validator';

export class TesterDto {
  @IsString()
  @IsNotEmpty()
  value: string;
}
