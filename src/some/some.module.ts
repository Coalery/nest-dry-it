import { Module } from '@nestjs/common';
import { SomeService } from './some.service';
import { OtherModule } from 'src/other/other.module';

@Module({
  imports: [OtherModule],
  providers: [{ provide: 'Something', useClass: SomeService }],
})
export class SomeModule {}
