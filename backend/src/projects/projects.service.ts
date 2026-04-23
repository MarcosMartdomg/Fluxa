import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { WorkflowsService } from '../workflows/workflows.service';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private workflowsService: WorkflowsService,
  ) {}

  private async assertProjectOwnership(userId: string, projectId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, userId },
      select: { id: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }
  }

  async findAll(userId: string) {
    return this.prisma.project.findMany({
      where: { userId },
      include: {
        _count: {
          select: { workflows: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: string, data: { name: string; description?: string }) {
    return this.prisma.project.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.assertProjectOwnership(userId, id);
    return this.prisma.project.delete({ where: { id } });
  }

  async getCanvas(userId: string, projectId: string) {
    await this.assertProjectOwnership(userId, projectId);

    const canvas = await this.prisma.projectCanvas.findUnique({
      where: { projectId },
      select: { cards: true, edges: true },
    });

    if (!canvas) {
      return { cards: [], edges: [] };
    }

    return canvas;
  }

  async updateCanvas(userId: string, projectId: string, data: { cards: unknown[]; edges: unknown[] }) {
    await this.assertProjectOwnership(userId, projectId);
    const cards = (Array.isArray(data.cards) ? data.cards : []) as Prisma.JsonArray;
    const edges = (Array.isArray(data.edges) ? data.edges : []) as Prisma.JsonArray;

    const result = await this.prisma.projectCanvas.upsert({
      where: { projectId },
      update: {
        cards,
        edges,
      },
      create: {
        projectId,
        cards,
        edges,
      },
      select: { cards: true, edges: true, updatedAt: true },
    });

    // 2. Sync to executable actions for any associated workflows
    const workflow = await this.prisma.workflow.findFirst({
      where: { projectId },
    });

    if (workflow) {
      await this.workflowsService.syncActionsFromCanvas(workflow.id);
    }

    return result;
  }
}
