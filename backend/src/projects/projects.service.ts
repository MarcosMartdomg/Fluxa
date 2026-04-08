import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

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
    return this.prisma.project.delete({
      where: {
        id,
        userId,
      },
    });
  }
}
