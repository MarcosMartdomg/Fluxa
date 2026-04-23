import { Controller, Post, Get, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('credentials')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post()
  @ApiOperation({ summary: 'Create or update a connection' })
  async create(@Request() req, @Body() data: { providerId: string; name: string; credentials: any }) {
    return this.credentialsService.create(req.user.id, data.providerId, data.name, data.credentials);
  }

  @Get(':providerId')
  @ApiOperation({ summary: 'Get all connections for a provider' })
  async findByProvider(@Request() req, @Param('providerId') providerId: string) {
    return this.credentialsService.findByProvider(req.user.id, providerId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a connection' })
  async remove(@Request() req, @Param('id') id: string) {
    return this.credentialsService.remove(req.user.id, id);
  }
}
