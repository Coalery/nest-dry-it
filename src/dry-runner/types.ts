import { InjectionToken, Provider, Type } from '@nestjs/common';

export type Module = Type<object>;
export type Controller = Type<object>;
export type TokenDefinition = { token: InjectionToken; exported: boolean };
export type TokenReference = InjectionToken;

export type DependencyError = {
  from: Controller | Provider;
  need: TokenReference;
};
