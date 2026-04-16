import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the person' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'The email of the person' })
  @IsEmail({}, { message: 'El formato del email no es válido' })
  @IsNotEmpty({ message: 'el email es obligatorio' })
  email: string;

  @ApiPropertyOptional({ example: 'Fluxa Inc.', description: 'The company name' })
  @IsString()
  @IsOptional()
  company?: string;

  @ApiProperty({ example: 'Information Request', description: 'The subject of the message' })
  @IsString()
  @IsNotEmpty({ message: 'El asunto es obligatorio' })
  @MinLength(3, { message: 'El asunto debe tener al menos 3 caracteres' })
  subject: string;

  @ApiProperty({ example: 'I would like to know more about Fluxa.', description: 'The message content' })
  @IsString()
  @IsNotEmpty({ message: 'El mensaje es obligatorio' })
  @MinLength(10, { message: 'El mensaje debe tener al menos 10 caracteres' })
  message: string;
}
