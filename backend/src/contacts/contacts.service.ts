import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactsService {
  private readonly logger = new Logger(ContactsService.name);

  constructor(private prisma: PrismaService) {}

  async create(createContactDto: CreateContactDto) {
    this.logger.log(`Creating new contact request from ${createContactDto.email}`);
    
    return this.prisma.contact.create({
      data: {
        ...createContactDto,
        status: 'PENDING',
      },
    });
  }

  async findAll() {
    return this.prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.contact.findUnique({
      where: { id },
    });
  }
}
