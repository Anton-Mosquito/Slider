interface IObjectKeys {
  [key: string]: boolean | number | undefined | Array<string | IUser> | string;
}

export interface IUser {
  id?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
}

export interface IConfig extends IObjectKeys {
  type?: string;
  loop?: boolean;
  autoplay?: boolean;
  interval?: number;
  pauseOnHover?: boolean;
  refresh?: boolean;
  swipe?: boolean;
  data?: Array<string | IUser>;
}
