import { Module, TokenDefinition, TokenReference } from './types';

export class TokenContainer<T extends TokenDefinition | TokenReference> {
  private readonly tokenMap: Map<Module, T[]> = new Map();

  add(module: Module, token: T) {
    const prevTokens = this.tokenMap.get(module) ?? [];
    this.tokenMap.set(module, prevTokens.concat(token));
  }

  get(module: Module): T[] {
    return this.tokenMap.get(module) || [];
  }

  has(module: Module): boolean {
    return this.tokenMap.has(module);
  }

  getAll(): Map<Module, T[]> {
    return this.tokenMap;
  }
}
