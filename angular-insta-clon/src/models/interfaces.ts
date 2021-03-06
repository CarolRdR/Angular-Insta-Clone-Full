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
  _id: string;
  profileImage: string;
  username: string;
  posts: [];
}

export interface PostDataI {
  _id: string;
  url: string | undefined;
  comments: [
    {
      _id: string;
      content: string;
      author_id: { username: string; _id: string };
    }
  ];
  user: UserDataI;
}

export interface MenuNavigationI {
  path: string;
  label: string;
  imageAlt: string;
}
