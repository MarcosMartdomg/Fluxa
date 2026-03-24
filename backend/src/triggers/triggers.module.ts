import { Module } from '@nestjs/common';
import { TriggersService } from './triggers.service';
import { TriggersController } from './triggers.controller';

@Module({
  providers: [TriggersService],
  controllers: [TriggersController],
  exports: [TriggersService],
})
export class TriggersModule {}
