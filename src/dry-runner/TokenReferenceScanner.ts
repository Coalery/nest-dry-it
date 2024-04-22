import {
  ClassProvider,
  ExistingProvider,
  FactoryProvider,
  Provider,
} from '@nestjs/common';
import { MetadataExtractor } from './MetadataExtractor';
import { TokenContainer } from './TokenContainer';
import { Module, TokenReference } from './types';

export class TokenReferenceScanner {
  constructor(private readonly container: TokenContainer<TokenReference>) {}

  scan(module: Module) {
    const moduleMetadata = MetadataExtractor.extractFromModule(module);
    moduleMetadata.imports?.forEach((module) => {
      this.scan(module as Module);
    });

    if (this.container.has(module)) {
      return;
    }

    moduleMetadata.providers?.forEach((provider) => {
      this.getTokenReferencesFromProvider(provider).forEach(
        (tokenReference) => {
          this.container.add(module, tokenReference);
          if (typeof tokenReference === 'object') {
            MetadataExtractor.extractTokens(tokenReference).forEach((token) => {
              this.container.add(module, token);
            });
          }
        },
      );

      MetadataExtractor.extractTokens(provider).forEach((token) => {
        this.container.add(module, token);
      });
    });

    moduleMetadata.controllers?.forEach((controller) => {
      MetadataExtractor.extractTokens(controller).forEach((token) => {
        this.container.add(module, token);
      });
    });
  }

  private getTokenReferencesFromProvider(provider: Provider): TokenReference[] {
    const fromExistingProvider = (
      provider: ExistingProvider,
    ): TokenReference[] => {
      return [provider.useExisting];
    };

    const fromFactoryProvider = (
      provider: FactoryProvider,
    ): TokenReference[] => {
      const references: TokenReference[] = [];

      provider.inject.forEach((inject) => {
        if (typeof inject === 'object' && 'optional' in inject) {
          references.push(inject.token);
        } else {
          references.push(inject);
        }
      });

      return references;
    };

    const fromClassProvider = (provider: ClassProvider): TokenReference[] => {
      return [provider.useClass];
    };

    if ('useExisting' in provider) {
      return fromExistingProvider(provider);
    } else if ('useFactory' in provider) {
      return fromFactoryProvider(provider);
    } else if ('useClass' in provider) {
      return fromClassProvider(provider);
    } else if ('useValue' in provider) {
      return [];
    } else {
      return [provider];
    }
  }
}
