import { IsString } from 'class-validator';

export class GenerateTokenDto {
  @IsString()
  conversationId: string;
}
