import { ModuleMetadata } from '@nestjs/common';
import {
  PARAMTYPES_METADATA,
  SELF_DECLARED_DEPS_METADATA,
} from '@nestjs/common/constants';

export class MetadataExtractor {
  static extractFromModule(module: object): ModuleMetadata {
    const imports = Reflect.getMetadata('imports', module);
    const controllers = Reflect.getMetadata('controllers', module);
    const providers = Reflect.getMetadata('providers', module);
    const exports = Reflect.getMetadata('exports', module);

    return { imports, controllers, providers, exports };
  }

  static extractTokens(ctor: object) {
    const paramtypes = [
      ...(Reflect.getMetadata(PARAMTYPES_METADATA, ctor) || []),
    ];
    const selfParams =
      Reflect.getMetadata(SELF_DECLARED_DEPS_METADATA, ctor) ?? [];

    selfParams.forEach(({ index, param }) => (paramtypes[index] = param));
    return paramtypes;
  }
}
