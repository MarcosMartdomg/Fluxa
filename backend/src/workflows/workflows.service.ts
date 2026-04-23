import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateWorkflowDto, UpdateWorkflowDto } from './dto/workflow.dto';
import { ActionType, TriggerType } from '@prisma/client';

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

  async syncActionsFromCanvas(workflowId: string) {
    const workflow = await this.prisma.workflow.findUnique({
      where: { id: workflowId },
      include: { project: { include: { canvas: true } } },
    });

    if (!workflow || !workflow.project?.canvas) return;

    const { cards, edges } = workflow.project.canvas as any;
    if (!Array.isArray(cards)) return;

    // 1. Handle Trigger
    const triggerNode = cards.find((n: any) => n.type === 'trigger');
    if (triggerNode) {
      await this.prisma.trigger.upsert({
        where: { workflowId },
        update: {
          type: TriggerType.WEBHOOK, // Default to WEBHOOK for now
          config: triggerNode.data?.config || {},
        },
        create: {
          workflowId,
          type: TriggerType.WEBHOOK,
          config: triggerNode.data?.config || {},
        },
      });
    }

    // 2. Handle Actions
    // Simple linear sort based on edges for now
    const actionNodes = cards.filter((n: any) => n.type === 'action');
    const sortedActions: any[] = [];
    
    let currentNodeId = triggerNode?.id;
    while (currentNodeId) {
      const edge = edges.find((e: any) => e.source === currentNodeId);
      if (!edge) break;
      
      const nextNode = actionNodes.find((n: any) => n.id === edge.target);
      if (!nextNode) break;
      
      sortedActions.push(nextNode);
      currentNodeId = nextNode.id;
    }

    // Clear and recreate actions
    await this.prisma.action.deleteMany({ where: { workflowId } });
    
    for (let i = 0; i < sortedActions.length; i++) {
      const node = sortedActions[i];
      let actionType = ActionType.HTTP_REQUEST; // Default
      
      if (node.data?.provider === 'google') actionType = ActionType.GOOGLE_SHEETS;
      if (node.data?.actionKey === 'delay') actionType = ActionType.DELAY;
      // ... more mappings as needed

      await this.prisma.action.create({
        data: {
          workflowId,
          name: node.data?.label || 'Action',
          type: actionType,
          config: { ...node.data?.config, actionKey: node.data?.actionKey },
          order: i,
        },
      });
    }
  }
}
