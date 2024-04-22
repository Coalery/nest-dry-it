import { InjectionToken, Provider } from '@nestjs/common';
import { MetadataExtractor } from './MetadataExtractor';
import { TokenContainer } from './TokenContainer';
import { Module, TokenDefinition } from './types';

export class TokenDefinitionScanner {
  constructor(private readonly container: TokenContainer<TokenDefinition>) {}

  scan(module: Module) {
    const moduleMetadata = MetadataExtractor.extractFromModule(module);
    moduleMetadata.imports?.forEach((module) => {
      this.scan(module as Module);
    });

    if (this.container.has(module)) {
      return;
    }

    const exportSet = new Set(moduleMetadata.exports ?? []);
    moduleMetadata.providers?.forEach((provider) => {
      this.container.add(module, {
        token: this.extractTokenFromProvider(provider),
        exported: exportSet.has(provider),
      });
    });
  }

  private extractTokenFromProvider(provider: Provider): InjectionToken {
    if ('provide' in provider) {
      return provider.provide;
    } else {
      return provider;
    }
  }
}
