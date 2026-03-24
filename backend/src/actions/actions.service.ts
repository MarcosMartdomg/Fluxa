import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ActionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.action.create({ data });
  }

  async findAllByWorkflow(workflowId: string) {
    return this.prisma.action.findMany({
      where: { workflowId },
      orderBy: { order: 'asc' },
    });
  }
}
