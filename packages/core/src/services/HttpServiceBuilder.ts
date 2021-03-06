import { IResponseAction, IBaseRequestAction, Types } from '../actions/BaseRequestAction';
import { METHOD } from '../utils/method';
import { ThrottleKeyOption } from './BaseHttpService';

type Options<Data, Response, Payload> = Partial<Omit<IBaseRequestAction<Data, Response, Payload>, 'type'>> & {
  uri: string;
  instanceName: string;
  method: METHOD;
};

export type ThrottleOptions = {
  /**
   * Millisecond
   *
   * `1000`  means 1 second
   * `60000` means 1 minute
   */
  duration: number;
  enable?: boolean;
  transfer?: ThrottleKeyOption['transfer'];
};

export class HttpServiceBuilder<Data, Response, Payload = unknown, RequestOption extends object = object, M = true> {
  protected readonly config: Options<Data, Response, Payload>;

  constructor(config: Options<Data, Response, Payload>) {
    this.config = config;
  }

  public query(query: object): this {
    this.config.query = query;

    return this;
  }

  public body(body: object): this {
    this.config.body = body;

    return this;
  }

  public successText(text: string): this {
    this.config.successText = text;

    return this;
  }

  public failText(text: string): this {
    this.config.failText = text;

    return this;
  }

  public requestOptions(options: RequestOption): this {
    this.config.requestOptions = options;

    return this;
  }

  public hideError(is: boolean | ((response: IResponseAction<unknown, Payload>) => boolean)): this {
    this.config.hideError = is;

    return this;
  }

  public throttle(options: ThrottleOptions): this {
    this.config.throttle = {
      enable: options.duration > 0 && options.enable !== false,
      duration: options.duration,
      transfer: options.transfer,
      key: '',
    };

    return this;
  }

  public payload<T>(payload: T): M extends true
    ? HttpServiceBuilderWithMeta<Data, Response, T, RequestOption, true>
    : HttpServiceBuilderWithMetas<Data, Response, T, RequestOption, M>
  {
    // @ts-ignore
    // @ts-expect-error
    this.config.payload = payload;
    // @ts-ignore
    // @ts-expect-error
    return this;
  }

  public metas(value: string): HttpServiceBuilderWithMetas<Data, Response, Payload, RequestOption, string>;
  public metas(value: number): HttpServiceBuilderWithMetas<Data, Response, Payload, RequestOption, number>;
  public metas(value: symbol): HttpServiceBuilderWithMetas<Data, Response, Payload, RequestOption, symbol>;
  public metas(value: string | number | symbol): HttpServiceBuilderWithMetas<Data, Response, Payload, RequestOption, string | number | symbol> {
    this.config.metaKey = value;

    // @ts-ignore
    // @ts-expect-error
    return this;
  };

  public onPrepare(fn: NonNullable<IBaseRequestAction<Data, Response, Payload>['onPrepare']>): this {
    this.config.onPrepare = fn;

    return this;
  }

  public afterPrepare(fn: NonNullable<IBaseRequestAction<Data, Response, Payload>['afterPrepare']>, duration?: number): this {
    this.config.afterPrepare = fn;
    this.config.afterPrepareDuration = duration;

    return this;
  }

  public onSuccess(fn: NonNullable<IBaseRequestAction<Data, Response, Payload>['onSuccess']>): this {
    this.config.onSuccess = fn;

    return this;
  }

  public afterSuccess(fn: NonNullable<IBaseRequestAction<Data, Response, Payload>['afterSuccess']>, duration?: number): this {
    this.config.afterSuccess = fn;
    this.config.afterSuccessDuration = duration;

    return this;
  }

  public onFail(fn: NonNullable<IBaseRequestAction<Data, Response, Payload>['onFail']>): this {
    this.config.onFail = fn;

    return this;
  }

  public afterFail(fn: NonNullable<IBaseRequestAction<Data, Response, Payload>['afterFail']>, duration?: number): this {
    this.config.afterFail = fn;
    this.config.afterFailDuration = duration;

    return this;
  }

  public/*protected*/ collect(actionName: string, types: Types): IBaseRequestAction<Data, Response, Payload> {
    const config = this.config;
    const action: IBaseRequestAction = {
      uri: config.uri,
      type: types,
      method: config.method,
      modelName: config.instanceName,
      payload: config.payload,
      body: config.body || {},
      query: config.query || {},
      successText: config.successText || '',
      failText: config.failText || '',
      hideError: config.hideError || false,
      requestOptions: config.requestOptions || {},
      metaKey: config.metaKey === undefined ? true : config.metaKey,
      actionName,
      onPrepare: config.onPrepare,
      afterPrepare: config.afterPrepare,
      afterPrepareDuration: config.afterPrepareDuration,
      onSuccess: config.onSuccess,
      afterSuccess: config.afterSuccess,
      afterSuccessDuration: config.afterSuccessDuration,
      onFail: config.onFail,
      afterFail: config.afterFail,
      afterFailDuration: config.afterFailDuration,
      throttle: config.throttle || {
        enable: false,
        duration: 0,
        transfer: undefined,
        key: '',
      },
    };

    return action;
  }
}

export declare class HttpServiceBuilderWithMeta<Data, Response, Payload, RequestOption extends object, M = true> extends HttpServiceBuilder<Data, Response, Payload, RequestOption, M> {
  private readonly _: string;
}

export declare class HttpServiceBuilderWithMetas<Data, Response, Payload, RequestOption extends object, M> extends HttpServiceBuilder<Data, Response, Payload, RequestOption, M> {
  private readonly _: string;
}
