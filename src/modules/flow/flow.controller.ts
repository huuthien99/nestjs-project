import { Body, Controller, Post } from '@nestjs/common';
import { FlowService } from './flow.service';

@Controller('flow')
export class FlowController {
  constructor(private readonly flowService: FlowService) {}
  @Post('/run')
  runFlow(@Body() data: any) {
    return this.flowService.runFlowService(data);
  }
}
