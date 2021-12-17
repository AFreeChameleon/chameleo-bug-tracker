import { User, Project, Role } from '@prisma/client';
import { NextApiHandler, NextApiRequest } from 'next';
import { IronSession } from 'iron-session';
import { ironSession } from 'iron-session/express';
import { withIronSessionSsr, withIronSessionApiRoute } from 'iron-session/next';

const withSession = (handler) => {
  return withIronSessionSsr(handler, {
    password: process.env.SESSION_PASSWORD,
    cookieName: 'chameleo-auth',
    cookieOptions: {
        secure: (process.env.NODE_ENV === 'production'),
    },
  });
}

export const session = ironSession({
  password: process.env.SESSION_PASSWORD,
  cookieName: 'chameleo-auth',
  cookieOptions: {
    secure: (process.env.NODE_ENV === 'production'),
  },
});

export interface NextApiRequestWithSession extends NextApiRequest {
  session: IronSession;
  user: User;
}

export interface NextApiRequestWithSessionRole extends NextApiRequest {
  session: IronSession;
  user: any;
}

declare module 'iron-session' {
  interface IronSessionData {
    user?: any;
  }
}

export default withSession;