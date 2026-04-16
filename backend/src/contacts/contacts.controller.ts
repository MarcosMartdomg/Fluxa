import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';

@ApiTags('contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new contact request' })
  @ApiResponse({ status: 201, description: 'The contact request has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactsService.create(createContactDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all contact requests' })
  @ApiResponse({ status: 200, description: 'Return all contact requests.' })
  findAll() {
    return this.contactsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific contact request' })
  @ApiResponse({ status: 200, description: 'Return a contact request.' })
  @ApiResponse({ status: 404, description: 'Contact request not found.' })
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(id);
  }
}
