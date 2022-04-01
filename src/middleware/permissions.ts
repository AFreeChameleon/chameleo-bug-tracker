import { NextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';
import { prisma }  from '../lib/prisma';
import withSession, { NextApiRequestWithSessionRole } from '../lib/session';
import { checkPermission } from '../lib/auth';

export const canUserEditUsers = async (req: NextApiRequestWithSessionRole, res: NextApiResponse, next: NextHandler) => {
    const userPermissions = checkPermission(req.user.roles[0].role);

    if (userPermissions.userReadWrite) {
        return next();
    }

    return res.status(403).json({
        errors: ['You do not have permission to edit users.']
    });
}

export const canUserEditTickets = async (req: NextApiRequestWithSessionRole, res: NextApiResponse, next: NextHandler) => {
    const userPermissions = checkPermission(req.user.roles[0].role);

    if (userPermissions.write) {
        return next();
    }

    return res.status(403).json({
        errors: ['You do not have permission to edit this.']
    });
}

export const canUserReadTickets = async (req: NextApiRequestWithSessionRole, res: NextApiResponse, next: NextHandler) => {
    const userPermissions = checkPermission(req.user.roles[0].role);

    if (userPermissions.read) {
        return next();
    }

    return res.status(403).json({
        errors: ['You do not have permission to read this.']
    });
}