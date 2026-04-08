import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateWorkflowDto, UpdateWorkflowDto } from './dto/workflow.dto';

@Injectable()
export class WorkflowsService {
  constructor(private prisma: PrismaService) {}

  async create(createWorkflowDto: CreateWorkflowDto, userId: string) {
    return this.prisma.workflow.create({
      data: {
        ...createWorkflowDto,
        userId,
      },
    });
  }

  async findAll(userId: string, projectId?: string) {
    return this.prisma.workflow.findMany({
      where: { 
        userId,
        ...(projectId ? { projectId } : {}),
      },
      include: { trigger: true, _count: { select: { actions: true } } },
    });
  }


  async findOne(id: string, userId: string) {
    const workflow = await this.prisma.workflow.findUnique({
      where: { id },
      include: { trigger: true, actions: { orderBy: { order: 'asc' } } },
    });

    if (!workflow) throw new NotFoundException(`Workflow ${id} not found`);
    if (workflow.userId !== userId) throw new ForbiddenException();

    return workflow;
  }

  async update(id: string, updateWorkflowDto: UpdateWorkflowDto, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.workflow.update({
      where: { id },
      data: updateWorkflowDto,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.workflow.delete({ where: { id } });
  }

  async toggle(id: string, isActive: boolean, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.workflow.update({
      where: { id },
      data: { isActive },
    });
  }
}
