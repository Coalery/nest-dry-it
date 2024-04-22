import { DependencyError } from './types';

export class DependencyErrorContainer {
  private readonly errors: DependencyError[] = [];

  add(error: DependencyError) {
    this.errors.push(error);
  }

  getAll() {
    return this.errors;
  }
}
