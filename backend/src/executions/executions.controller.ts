import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExecutionsService } from './executions.service';

@ApiTags('executions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('executions')
export class ExecutionsController {
  constructor(private readonly executionsService: ExecutionsService) {}

  @Post('workflow/:workflowId')
  @ApiOperation({ summary: 'Trigger a workflow execution manually' })
  execute(@Param('workflowId') workflowId: string, @Body() payload: any) {
    return this.executionsService.trigger(workflowId, payload);
  }

  @Get('workflow/:workflowId')
  @ApiOperation({ summary: 'Get executions for a workflow' })
  findAllByWorkflow(@Param('workflowId') workflowId: string) {
    return this.executionsService.findAllByWorkflow(workflowId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get execution details' })
  findOne(@Param('id') id: string) {
    return this.executionsService.findOne(id);
  }
}
