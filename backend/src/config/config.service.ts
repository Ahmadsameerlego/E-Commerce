import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EngineConfigService {
  private config: any;

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    try {
      const configPath = path.join(__dirname, 'engine.config.json');
      const fileContents = fs.readFileSync(configPath, 'utf8');
      this.config = JSON.parse(fileContents);
    } catch (e) {
      console.warn('Could not load engine.config.json, using fallback configuration');
      this.config = {
        clientName: 'Fallback Store',
        theme: 'default-theme',
        currency: 'USD',
        features: {}
      };
    }
  }

  get clientName(): string {
    return this.config.clientName;
  }

  get theme(): string {
    return this.config.theme;
  }

  get currency(): string {
    return this.config.currency;
  }

  get features(): Record<string, boolean> {
    return this.config.features;
  }
  
  get raw() {
    return this.config;
  }
}
