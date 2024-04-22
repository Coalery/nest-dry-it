import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SomeModule } from './some/some.module';
import { OtherModule } from './other/other.module';

@Module({
  imports: [SomeModule, OtherModule],
  controllers: [AppController],
  providers: [AppService, { provide: 'Hello', useValue: 'Hello World!' }],
})
export class AppModule {}
