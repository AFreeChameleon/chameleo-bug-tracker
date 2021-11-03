import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import multer from 'multer';
import * as yup from 'yup';
import bcrypt from 'bcrypt';
import timestring from 'timestring';
import { prisma }  from '../../../../../lib/prisma';
import withSession, { NextApiRequestWithSession, session } from '../../../../../lib/session';
import { isUserLoggedIn } from '../../../../../middleware/auth';
import { mapIntToPriority, mapIntToStatus, validateTime } from '../../../../../lib/ticket';

const schema = yup.object().shape({
    name: yup.string()
        .required('Name is required.'),
    description: yup.string(),
    tags: yup.array().nullable(),
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

const handler = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse) {
        console.log(error)
        res.status(500).json({
            errors: ['An error occurred while creating your project, please try again later.']
        })
    },
    onNoMatch(req, res) {
        res.status(405).json({ errors: [`Method '${req.method}' Not Allowed`] });
    },
});

const upload = multer({
    storage: multer.diskStorage({
        destination: './public/img/uploads',
        filename: (req, file, cb) => cb(null, file.originalname),
    }),
});

handler.use(session);
handler.use(isUserLoggedIn);
handler.use(upload.array('attachments'));

handler.post(async (req: any, res: NextApiResponse) => {
    console.log('new ticket', req.files, req.body)
    try {
        const {
            name,
            description,
            tags = [],
            status,
            priority,
            assignedTo,
            estimate,
            attachments
        } = schema.validateSync(req.body);
        const projects = await prisma.project.findMany({
            where: {
                name: name,
                userId: req.user.id
            },
            select: {
                id: true,
                tags: true
            }
        });
        if (projects.length === 0) {
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

        const latestTicket = await prisma.ticket.findMany({
            where: {
                userId: req.user.id,
                projectId: projects[0].id,
            },
            select: {
                ticketNumber: true,
            },
            orderBy: {
                createdAt: 'asc'
            },
            take: 1
        })

        const ticket = await prisma.ticket.create({
            data: {
                userId: req.user.id,
                name: name,
                description: description,
                projectId: projects[0].id,
                // status: mapIntToStatus(status),
                priority: mapIntToPriority(priority),
                assignedUserId: assignedUser ? assignedUser.id : null,
                timeEstimate: validateTime(estimate) || '0m',
                ticketNumber: (latestTicket && latestTicket[0]) ? latestTicket[0].ticketNumber + 1 : 1
            },
        });

        const updatedProject = await prisma.project.update({
            where: {
                id: projects[0].id,
            },
            data: {
                details: {

                }
            }
        })

        const tagList = await prisma.tagTicketJunction.createMany({
            data: projects[0].tags
            .filter((tag) => 
                tags.findIndex(t => t.name === tag.name)
            ).map((tag) => ({
                tagId: tag.id,
                ticketId: ticket.id,
            }))
        });

        if (attachments && attachments.length > 0) {
            const attachmentList = await prisma.attachment.createMany({
                data: req.files.map((file) => ({
                    originalName: file.originalName,
                    fileName: file.filename,
                    encoding: file.encoding,
                    mimetype: file.mimetype,
                    destination: file.destination,
                    path: file.path,
                    size: file.size
                }))
            });
        }

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
});

export default handler;

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
};