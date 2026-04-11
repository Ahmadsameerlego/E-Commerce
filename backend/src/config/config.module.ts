import { Global, Module } from '@nestjs/common';
import { EngineConfigService } from './config.service';

@Global()
@Module({
  providers: [EngineConfigService],
  exports: [EngineConfigService],
})
export class EngineConfigModule {}
