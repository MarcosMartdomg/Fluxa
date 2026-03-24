import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActionsService } from './actions.service';

@ApiTags('actions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Post()
  @ApiOperation({ summary: 'Add an action to a workflow' })
  create(@Body() createActionDto: any) {
    return this.actionsService.create(createActionDto);
  }

  @Get('workflow/:workflowId')
  @ApiOperation({ summary: 'Get actions for a specific workflow' })
  findAllByWorkflow(@Param('workflowId') workflowId: string) {
    return this.actionsService.findAllByWorkflow(workflowId);
  }
}
