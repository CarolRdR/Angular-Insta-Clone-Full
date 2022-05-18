export interface AuthLoginI {
  email: string;
  password: string;
}
export interface AuthRegisterI {
  username: string;
  email: string;
  password: string;
}

export interface UserDataI {
  email: string;
  token: string;
  id: string;
  profileImage: string;
  username: string;
  posts: [];
}

export interface PostDataI {
  _id: string;
  url: string | undefined;
  comments: Array<any>;
  user: string;
}

export interface MenuNavigationI {
  path: string;
  label: string;
  imageAlt: string;
}
