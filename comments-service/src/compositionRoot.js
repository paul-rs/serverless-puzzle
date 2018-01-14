import {
  InjectionMode,
  asClass,
  asFunction,
  createContainer,
  Lifetime
} from "awilix";
import Config from "./config";
import CommentsInterface from "./commentsInterface";
import CommentsS3Repository from "./commentsS3Repository";

export default function configureContainer() {
  const container = createContainer({
    injectionMode: InjectionMode.PROXY
  });

  container.register({
    config: asClass(Config).setLifetime(Lifetime.SINGLETON)
  });

  container.register({ commentsInterface: asClass(CommentsInterface) });
  container.register({ commentsRepository: asClass(CommentsS3Repository) });

  return container;
}
