import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Put } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectsService } from './projects.service';

@ApiTags('projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all user projects' })
  @ApiResponse({ status: 200, description: 'Return list of projects' })
  findAll(@Request() req) {
    return this.projectsService.findAll(req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project successfully created' })
  create(@Request() req, @Body() data: { name: string; description?: string }) {
    return this.projectsService.create(req.user.userId, data);
  }

  @Get(':id/canvas')
  @ApiOperation({ summary: 'Get project canvas state' })
  @ApiResponse({ status: 200, description: 'Return project canvas state' })
  getCanvas(@Request() req, @Param('id') id: string) {
    return this.projectsService.getCanvas(req.user.userId, id);
  }

  @Put(':id/canvas')
  @ApiOperation({ summary: 'Update project canvas state' })
  @ApiResponse({ status: 200, description: 'Project canvas successfully updated' })
  updateCanvas(
    @Request() req,
    @Param('id') id: string,
    @Body() data: { cards: unknown[]; edges: unknown[] },
  ) {
    return this.projectsService.updateCanvas(req.user.userId, id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project' })
  @ApiResponse({ status: 200, description: 'Project successfully deleted' })
  remove(@Request() req, @Param('id') id: string) {
    return this.projectsService.remove(req.user.userId, id);
  }
}

