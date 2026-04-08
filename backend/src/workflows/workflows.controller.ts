import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';

import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDto, UpdateWorkflowDto, ToggleWorkflowDto } from './dto/workflow.dto';

@ApiTags('workflows')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workflows')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new workflow' })
  create(@Body() createWorkflowDto: CreateWorkflowDto, @Request() req) {
    return this.workflowsService.create(createWorkflowDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user workflows' })
  findAll(@Request() req, @Query('projectId') projectId?: string) {
    return this.workflowsService.findAll(req.user.userId, projectId);
  }


  @Get(':id')
  @ApiOperation({ summary: 'Get workflow by ID' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.workflowsService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update workflow' })
  update(@Param('id') id: string, @Body() updateWorkflowDto: UpdateWorkflowDto, @Request() req) {
    return this.workflowsService.update(id, updateWorkflowDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete workflow' })
  remove(@Param('id') id: string, @Request() req) {
    return this.workflowsService.remove(id, req.user.userId);
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Toggle workflow status' })
  toggle(@Param('id') id: string, @Body() toggleDto: ToggleWorkflowDto, @Request() req) {
    return this.workflowsService.toggle(id, toggleDto.isActive, req.user.userId);
  }
}
