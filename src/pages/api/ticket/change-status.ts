import { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import bcrypt from 'bcrypt';
import { prisma }  from '../../../lib/prisma';
import withSession, { NextApiRequestWithSession } from '../../../lib/session';
import { isUserLoggedIn } from '../../../middleware/auth';
import { mapIntToStatus } from '../../../lib/ticket';

const schema = yup.object().shape({
    ticket_id: yup.number()
        .integer().required('Ticket id is required.'),
    status: yup.number()
        .integer().required('Status is required.'),
});

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    switch (req.method) {
        case 'PATCH':
            isUserLoggedIn(req, res, updateTicketStatus);
            break;
        default:
            res.status(404).json({
                errors: ['Could not find route specified.']
            });
            break;
    }
});

const updateTicketStatus = async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    try {
        const { ticket_id, status } = schema.validateSync(req.body);
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                id: true,
                projects: {
                    select: {
                        tickets: true
                    }
                }
            }
        });
        const ticket = user.projects.find((p) => p.tickets.find((t) => t.id === ticket_id));
        if (!ticket) {
            return res.status(404).json({
                errors: ['Ticket does not exist.']
            });
        }
        const updatedTicket = await prisma.ticket.update({
            where: {
                id: ticket_id
            },
            data: {
                status: mapIntToStatus(status)
            }
        });

        return res.json({
            message: 'Successfully updated ticket\'s status.'
        });
    } catch (err) {
        console.log(err);
        if (err.errors) {
            return res.status(500).json({
                errors: err.errors
            });
        }
        return res.status(500).json({
            errors: ['An error occurred while creating your project, please try again later.']
        })
    }
}