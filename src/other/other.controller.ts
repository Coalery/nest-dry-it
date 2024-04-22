import { Controller, Inject } from '@nestjs/common';
import { ExportedService } from './exported.service';
import { NoExportService } from './no-export.service';
import { NotInModuleService } from './not-in-module.service';
import { SomeService } from 'src/some/some.service';

@Controller()
export class OtherController {
  constructor(
    private readonly s1: ExportedService,
    private readonly s2: NoExportService,
    @Inject(NotInModuleService)
    private readonly s3: NotInModuleService,
    private readonly s4: SomeService,
  ) {}
}
