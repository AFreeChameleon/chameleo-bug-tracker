import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import * as yup from 'yup';
import bcrypt from 'bcrypt';
import { prisma }  from '../../../../../../../lib/prisma';
import withSession, { NextApiRequestWithSession, session } from '../../../../../../../lib/session';
import { isUserLoggedInWithRole } from '../../../../../../../middleware/auth';
import { getTicket } from '../../../../../../../lib/db';
import { canUserEditTickets } from '../../../../../../../middleware/permissions';

const schema = yup.object().shape({
    tags: yup.array().required()
});

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
handler.use(canUserEditTickets);

handler.post(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    try {
        const project_id = req.query.project_id as string;
        const ticket_number = req.query.ticket_number as string;
        const { message } = req.body;

        const ticket = await getTicket(project_id, parseInt(ticket_number));
        const comment = await prisma.comment.create({
            data: {
                ticketId: ticket.id,
                userId: req.user.id,
                message: message
            },
        });

        const newTicket = await getTicket(project_id, parseInt(ticket_number));

        return res.json({
            ticket: {
                ...newTicket,
            }
        });
    } catch (err) {
        console.log(err);
        if (err.errors) {
            return res.status(500).json({
                errors: err.errors
            });
        }
        return res.status(500).json({
            errors: ['An error occurred while editing this ticket\'s tags, please try again later.']
        })
    }
});

export default handler;