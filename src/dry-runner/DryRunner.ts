import { DependencyErrorContainer } from './DependencyErrorContainer';
import { DependencyErrorPrinter } from './DependencyErrorPrinter';
import { DependencyErrorScanner } from './DependencyErrorScanner';
import { ModuleDependencyGraph } from './ModuleDependencyGraph';
import { TokenContainer } from './TokenContainer';
import { TokenDefinitionScanner } from './TokenDefinitionScanner';
import { TokenReferenceScanner } from './TokenReferenceScanner';
import { Module, TokenDefinition, TokenReference } from './types';

export class DryRunner {
  static run(rootModule: Module) {
    const tokenDefinitionContainer = new TokenContainer<TokenDefinition>();
    const tokenDefinitionScanner = new TokenDefinitionScanner(
      tokenDefinitionContainer,
    );

    const tokenReferenceContainer = new TokenContainer<TokenReference>();
    const tokenReferenceScanner = new TokenReferenceScanner(
      tokenReferenceContainer,
    );

    const moduleDependencyGraph = new ModuleDependencyGraph();

    tokenDefinitionScanner.scan(rootModule);
    tokenReferenceScanner.scan(rootModule);
    moduleDependencyGraph.generate(rootModule);

    const dependencyErrorContainer = new DependencyErrorContainer();
    const dependencyErrorScanner = new DependencyErrorScanner(
      tokenDefinitionContainer,
      tokenReferenceContainer,
      moduleDependencyGraph,
      dependencyErrorContainer,
    );
    dependencyErrorScanner.scan(rootModule);

    dependencyErrorContainer.getAll().forEach((error) => {
      DependencyErrorPrinter.print(error);
    });
  }
}
