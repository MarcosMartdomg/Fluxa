import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class TriggersService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.trigger.upsert({
      where: { workflowId: data.workflowId },
      update: data,
      create: data,
    });
  }

  async findByWorkflow(workflowId: string) {
    return this.prisma.trigger.findUnique({ where: { workflowId } });
  }
}
