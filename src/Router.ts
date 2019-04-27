import Controller from './controllers/Controller';
import { IRoute } from './interfaces/Route';
import { Application } from 'express';
import { getControllers } from './controllers';

export default class Router {
  private controllers: Controller[];

  constructor(controllers: Controller[]) {
    this.controllers = controllers;
  }

  public static getDefault(): Promise<Router> {
    return new Promise<Router>(async (resolve, reject) => {
      try {
        const controllers = await getControllers();
        const router = new Router(controllers);
        return resolve(router);
      } catch (e) {
        return reject(e);
      }
    });
  }

  public route(app: Application): void {
    this.controllers.forEach((controller) => {
      // @ts-ignore
      const instance = new controller();
      instance.getRoutes().forEach((route: IRoute) => {
        const { methodName, method, url, middlewares } = route;
        // @ts-ignore
        app[method](url, middlewares, instance[methodName]);
      });
    });
  }
}
