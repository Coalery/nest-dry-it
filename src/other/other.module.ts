import { Module } from '@nestjs/common';
import { ExportedService } from './exported.service';
import { NoExportService } from './no-export.service';
import { OtherController } from './other.controller';

@Module({
  providers: [ExportedService, NoExportService],
  controllers: [OtherController],
  exports: [ExportedService],
})
export class OtherModule {}
