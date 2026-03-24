import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TriggersService } from './triggers.service';

@ApiTags('triggers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('triggers')
export class TriggersController {
  constructor(private readonly triggersService: TriggersService) {}

  @Post()
  @ApiOperation({ summary: 'Configure a trigger for a workflow' })
  create(@Body() createTriggerDto: any) {
    return this.triggersService.create(createTriggerDto);
  }

  @Get('workflow/:workflowId')
  @ApiOperation({ summary: 'Get trigger for a specific workflow' })
  findByWorkflow(@Param('workflowId') workflowId: string) {
    return this.triggersService.findByWorkflow(workflowId);
  }
}
