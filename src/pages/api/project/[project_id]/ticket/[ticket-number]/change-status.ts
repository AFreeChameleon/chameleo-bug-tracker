import { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import bcrypt from 'bcrypt';
import nextConnect from 'next-connect';
import { prisma }  from '../../../../../../lib/prisma';
import withSession, { NextApiRequestWithSession, session } from '../../../../../../lib/session';
import { isUserLoggedIn } from '../../../../../../middleware/auth';
import { mapIntToStatus } from '../../../../../../lib/ticket';

const schema = yup.object().shape({
    ticket_id: yup.number()
        .integer().required('Ticket id is required.'),
    status: yup.number()
        .integer().required('Status is required.'),
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

handler.patch(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    try {
        const project_id = req.query.project_id as string;
        const ticket_number = req.query.ticket_number as string;
        const { ticket_id, status } = schema.validateSync(req.body);
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                id: true,
                projects: {
                    select: {
                        tickets: true,
                    }
                }
            }
        });
        const project = await prisma.project.findFirst({
            where: {
                id: project_id,
            },
            select: {
                tickets: true
            }
        });

        if (!project) {
            return res.status(404).json({
                errors: ["Project doesn't exist"]
            })
        }
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
})

export default handler;