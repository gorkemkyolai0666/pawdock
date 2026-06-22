import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  check() {
    return { status: 'ok', service: 'pawdock-api', timestamp: new Date().toISOString() };
  }
}
