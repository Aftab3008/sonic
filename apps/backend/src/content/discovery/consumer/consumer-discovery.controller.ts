import { Controller, Get } from '@nestjs/common';
import { ConsumerDiscoveryService } from './consumer-discovery.service';
import { Roles } from '@thallesp/nestjs-better-auth';

@Controller('api/v1/discovery')
@Roles(['admin', 'user'])
export class ConsumerDiscoveryController {
  constructor(private readonly discoveryService: ConsumerDiscoveryService) {}

  @Get('home')
  async getHomeDiscovery() {
    return await this.discoveryService.getHomeDiscovery();
  }
}
