import { MetadataExtractor } from './MetadataExtractor';
import { Module } from './types';

export class ModuleDependencyGraph {
  private readonly graph: Map<Module, Module[]> = new Map();

  generate(module: Module) {
    const moduleMetadata = MetadataExtractor.extractFromModule(module);
    moduleMetadata.imports?.forEach((module) => {
      this.generate(module as Module);
    });

    if (moduleMetadata.imports?.length > 0) {
      this.graph.set(module, moduleMetadata.imports as Module[]);
    }
  }

  getAllDependenciesOf(moduleName: Module): Module[] {
    const dependencies: Module[] = [];

    const queue: Module[] = [moduleName];
    while (queue.length > 0) {
      const currentModule = queue.shift();
      if (!currentModule) {
        break;
      }

      const moduleDependencies = this.graph.get(currentModule);
      if (moduleDependencies) {
        dependencies.push(...moduleDependencies);
        queue.push(...moduleDependencies);
      }
    }

    return dependencies;
  }

  getAll(): Map<Module, Module[]> {
    return this.graph;
  }
}
