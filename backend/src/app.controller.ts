import { Controller, Get } from '@nestjs/common';
import { EngineConfigService } from './config/config.service';

@Controller()
export class AppController {
  constructor(private readonly configService: EngineConfigService) {}

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      engine: 'ecommerce-core',
      client: this.configService.clientName,
      timestamp: new Date().toISOString()
    };
  }
}
