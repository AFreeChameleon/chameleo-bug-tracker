import { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import nextConnect from 'next-connect';
import bcrypt from 'bcrypt';
import { prisma }  from '../../../lib/prisma';
import withSession, { NextApiRequestWithSession, session } from '../../../lib/session';
import { isUserLoggedIn } from '../../../middleware/auth';

const schema = yup.object().shape({
    project_id: yup.string()
        .required('Project ID is required.'),
    ticket_number: yup.number()
        .required('Ticket number is required.')
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
handler.use(isUserLoggedIn);

handler.post(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    try {
        const {
            project_id,
            ticket_number
        } = schema.validateSync(req.body);
        const ticket = await prisma.ticket.findFirst({
            where: {
                projectId: project_id,
                ticketNumber: ticket_number
            }
        });
        const history = await prisma.history.create({
            data: {
                projectId: project_id,
                ticketId: ticket.id,
                userId: req.user.id
            },
            
        });
        return res.json({
            history
        });
    } catch (err) {
        console.log(err)
        if (err.errors) {
            return res.status(500).json({
                errors: err.errors
            });
        }
        return res.status(500).json({
            errors: ['An error occurred while getting your details, please try again later.']
        });
    }
})

export default handler;