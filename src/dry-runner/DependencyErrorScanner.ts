import { DependencyErrorContainer } from './DependencyErrorContainer';
import { MetadataExtractor } from './MetadataExtractor';
import { ModuleDependencyGraph } from './ModuleDependencyGraph';
import { TokenContainer } from './TokenContainer';
import { Module, TokenDefinition, TokenReference } from './types';

export class DependencyErrorScanner {
  private readonly visited: Set<Module> = new Set();

  constructor(
    private readonly tokenDefinitionContainer: TokenContainer<TokenDefinition>,
    private readonly tokenReferenceContainer: TokenContainer<TokenReference>,
    private readonly moduleDependencyGraph: ModuleDependencyGraph,
    private readonly dependencyErrorContainer: DependencyErrorContainer,
  ) {}

  scan(module: Module) {
    const moduleMetadata = MetadataExtractor.extractFromModule(module);
    moduleMetadata.imports?.forEach((module) => {
      this.scan(module as Module);
    });

    if (this.visited.has(module)) {
      return;
    }

    const myTokens = this.tokenDefinitionContainer.get(module);
    const importsTokens = this.moduleDependencyGraph
      .getAllDependenciesOf(module)
      .map((m) =>
        this.tokenDefinitionContainer.get(m).filter((t) => t.exported),
      )
      .flat();
    const availableTokens = new Set(
      myTokens.concat(importsTokens).map((t) => t.token),
    );

    this.tokenReferenceContainer.get(module).forEach((token) => {
      if (!availableTokens.has(token)) {
        this.dependencyErrorContainer.add({ from: module, need: token });
      }
    });

    this.visited.add(module);
  }
}
