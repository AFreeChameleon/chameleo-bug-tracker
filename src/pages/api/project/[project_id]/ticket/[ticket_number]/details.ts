import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import * as yup from 'yup';
import bcrypt from 'bcrypt';
import { prisma }  from '../../../../../../lib/prisma';
import withSession, { NextApiRequestWithSession, session } from '../../../../../../lib/session';
import { isUserLoggedInWithRole } from '../../../../../../middleware/auth';

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

handler.get(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    try {
        const { ticket_number, project_id }: any = req.query;
        const ticket: any = await prisma.ticket.findFirst({
            where: {
                ticketNumber: parseInt(ticket_number),
                projectId: project_id
            },
            select: {
                id: true,
                name: true,
                createdAt: true,
                updatedAt: true,
                projectId: true,
                description: true,
                timeEstimate: true,
                ticketNumber: true,
                status: true,
                priority: true,
                started: true,
                archived: true,
                assignedUserId: true,
                user: {
                    select: {
                        id: true,
                        lastName: true,
                        firstName: true,
                        email: true,
                        createdAt: true,
                        updatedAt: true
                    }
                },
                tags: {
                    select: {
                        tag: {
                            select: {
                                name: true,
                            }
                        }
                    }
                }
            },
        });

        if (!ticket) {
            return res.status(404).json({
                errors: ['Ticket does not exist.']
            });
        }

        if (ticket.assignedUserId) {
            ticket.assignedUser = await prisma.user.findUnique({
                where: {
                    id: ticket.assignedUserId
                },
                select: {
                    id: true,
                    lastName: true,
                    firstName: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
        }
        
        return res.json({
            ticket: {
                ...ticket,
            }
        });
    } catch (err) {
        return res.status(500).json({
            errors: ['An error occurred while getting tickets, please try again later.']
        })
    }
})

export default handler;