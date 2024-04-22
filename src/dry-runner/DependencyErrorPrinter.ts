import { DependencyError } from './types';

export class DependencyErrorPrinter {
  static print(error: DependencyError) {
    console.error(
      `\x1b[32m"%s"\x1b[0m가 자신이 참조하는 \x1b[32m"%s"\x1b[0m 토큰에 접근할 수 없습니다.`,
      error.from.name,
      error.need.name,
    );
  }
}
