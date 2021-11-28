import { User, Project, Role } from '@prisma/client';
import { NextApiRequest } from 'next';
import { withIronSession, Session, ironSession } from 'next-iron-session'

const withSession = (handler) => {
  return withIronSession(handler, {
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

type RoleProject = Project & {
  role: Role
}

interface UserWithRole {
  id: number;
  projects: Project[];
}

export interface NextApiRequestWithSession extends NextApiRequest {
  session: Session;
  user: User;
}

export interface NextApiRequestWithSessionRole extends NextApiRequest {
  session: Session;
  user: any;
}



export default withSession;