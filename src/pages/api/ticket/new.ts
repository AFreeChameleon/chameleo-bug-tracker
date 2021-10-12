import { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import bcrypt from 'bcrypt';
import timestring from 'timestring';
import { prisma }  from '../../../lib/prisma';
import withSession, { NextApiRequestWithSession } from '../../../lib/session';
import { isUserLoggedIn } from '../../../middleware/auth';
import { mapIntToPriority, mapIntToStatus, validateTime } from '../../../lib/ticket';

const schema = yup.object().shape({
    name: yup.string()
        .required('Name is required.'),
    description: yup.string(),
    tags: yup.array(),
    project_company: yup.string()
        .required('Project is required.'),
    status: yup.number()
        .integer().required('Status is required.'),
    priority: yup.number()
        .integer().required('Priority is required.'),
    assignedTo: yup.string()
        .email(),
    attachments: yup.array(),
    estimate: yup.string()
});

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    switch (req.method) {
        case 'POST':
            isUserLoggedIn(req, res, postNewTicket);
            break;
        default:
            res.status(404).json({
                errors: ['Could not find route specified.']
            });
            break;
    }
});

const postNewTicket = async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    try {
        const {
            name,
            description,
            tags,
            project_company,
            status,
            priority,
            assignedTo,
            estimate,
            attachments
        } = schema.validateSync(req.body);
        const project = await prisma.project.findUnique({
            where: {
                company: project_company
            },
            select: {
                id: true
            }
        });
        if (!project) {
            return res.status(404).json({
                errors: ['Project doesn\'t exist.']
            })
        }
        const existingTicket = await prisma.ticket.findMany({
            where: {
                name: name
            }
        });
        if (existingTicket.length > 0) {
            return res.status(404).json({
                errors: ['Ticket with that name already exists.']
            })
        }

        const assignedUser = await prisma.user.findUnique({
            where: {
                email: assignedTo
            },
            select: {
                id: true
            }
        });

        const ticket = await prisma.ticket.create({
            data: {
                userId: req.user.id,
                name: name,
                description: description,
                projectId: project.id,
                status: mapIntToStatus(status),
                priority: mapIntToPriority(priority),
                assignedUserId: assignedUser ? assignedUser.id : null,
                timeEstimate: validateTime(estimate) || '0m'
            },
        });

        const tagList = await prisma.tag.createMany({
            data: tags.map((tag) => ({
                name: tag.name,
                ticketId: ticket.id,
                projectId: project.id
            }))
        })

        return res.json({
            message: 'Successfully created ticket.'
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