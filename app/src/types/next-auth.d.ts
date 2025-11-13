/* eslint-disable @typescript-eslint/no-empty-object-type */
import { DefaultSession, DefaultUser } from 'next-auth';
import 'next-auth/jwt';

export type UserResponse = {
  id?: string;
  email?: string;
  name?: string;
  image?: string;
  role?: string;
  office?: string | null;
};

declare module 'next-auth' {
  interface Session {
    user: UserResponse & DefaultSession['user'];
  }
  interface User extends DefaultUser, UserResponse {}
}

declare module 'next-auth/jwt' {
  interface jwt extends UserResponse {}
}