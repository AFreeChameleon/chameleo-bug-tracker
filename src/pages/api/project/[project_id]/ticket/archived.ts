import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import * as yup from 'yup';
import bcrypt from 'bcrypt';
import { prisma }  from '../../../../../lib/prisma';
import withSession, { NextApiRequestWithSession, NextApiRequestWithSessionRole, session } from '../../../../../lib/session';
import { isUserLoggedIn, isUserLoggedInWithRole } from '../../../../../middleware/auth';
import { canUserReadTickets } from '../../../../../middleware/permissions';

const handler = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse) {
        console.log(error)
        res.status(500).json({
            errors: ['An error occurred while getting tickets, please try again later.']
        })
    },
    onNoMatch(req, res) {
        res.status(405).json({ errors: [`Method '${req.method}' Not Allowed`] });
    },
});

handler.use(session);
handler.use(isUserLoggedInWithRole);
handler.use(canUserReadTickets);

handler.get(async (req: NextApiRequestWithSessionRole, res: NextApiResponse) => {
    try {
        const project_id = req.query.project_id as string;
        const archivedTickets = await prisma.ticket.findMany({
            where: {
                projectId: project_id,
                archived: true
            },
            select: {
                id: true,
                timeEstimate: true,
                status: true,
                priority: true,
                description: true,
                name: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true
                    }
                },
                assignedUserId: true,
                source: true,
                started: true,
                createdAt: true,
                updatedAt: true,
                ticketNumber: true
            }
        });
        return res.json({
            tickets: archivedTickets
        })
    } catch (err) {
        console.log(err);
        if (err.errors) {
            return res.status(500).json({
                errors: err.errors
            });
        }
        return res.status(500).json({
            errors: ['An error occurred while getting project details, please try again later.']
        })
    }
});

export default handler;