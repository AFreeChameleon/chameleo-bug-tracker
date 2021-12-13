import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import * as yup from 'yup';
import bcrypt from 'bcrypt';
import { prisma }  from '../../../../../../lib/prisma';
import withSession, { NextApiRequestWithSession, session } from '../../../../../../lib/session';
import { isUserLoggedInWithRole } from '../../../../../../middleware/auth';
import { getTicket } from '../../../../../../lib/db';
import { canUserReadTickets } from '../../../../../../middleware/permissions';

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

handler.get(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    try {
        const { ticket_number, project_id }: any = req.query;
        const ticket = await getTicket(project_id, parseInt(ticket_number));

        if (!ticket) {
            return res.status(404).json({
                errors: ['Ticket does not exist.']
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