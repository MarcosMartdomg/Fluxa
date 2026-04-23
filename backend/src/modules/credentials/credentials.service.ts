import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class CredentialsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, providerId: string, name: string, credentials: any) {
    return this.prisma.connection.upsert({
      where: {
        userId_providerId_name: {
          userId,
          providerId,
          name,
        },
      },
      update: {
        credentials,
      },
      create: {
        userId,
        providerId,
        name,
        credentials,
      },
    });
  }

  async findByProvider(userId: string, providerId: string) {
    return this.prisma.connection.findMany({
      where: {
        userId,
        providerId,
      },
    });
  }

  async findById(userId: string, id: string) {
    return this.prisma.connection.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  async remove(userId: string, id: string) {
    return this.prisma.connection.delete({
      where: {
        id,
        userId,
      },
    });
  }
}
