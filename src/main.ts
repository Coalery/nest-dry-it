import { AppModule } from './app.module';
import { DryRunner } from './dry-runner/DryRunner';

async function bootstrap() {
  DryRunner.run(AppModule);
}
bootstrap();
