import { NextApiRequest, NextApiResponse } from 'next';
import _ from 'lodash';
import nextConnect from 'next-connect';
import multer from 'multer';
import fs from 'fs';
import * as yup from 'yup';
import bcrypt from 'bcrypt';
import timestring from 'timestring';
import { prisma }  from '../../../../../lib/prisma';
import withSession, { NextApiRequestWithSession, session } from '../../../../../lib/session';
import { isUserLoggedIn } from '../../../../../middleware/auth';
import { mapIntToPriority, mapIntToStatus, validateTime } from '../../../../../lib/ticket';
import { canUserEditTickets } from '../../../../../middleware/permissions';

const schema = yup.object().shape({
    name: yup.string()
        .required('Name is required.'),
    description: yup.string(),
    tags: yup.array().nullable(),
    status: yup.string()
        .required('Status is required.'),
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
        // destination: './public/img/uploads',
        destination: (req, file, cb) => {
            const { project_id } = req.query;
            const path = `./public/img/uploads/${project_id}`;
            fs.mkdirSync(path, { recursive: true });
            cb(null, './public/img/uploads/' + project_id);
        },
        filename: (req, file, cb) => cb(null, file.originalname),
    }),
});

handler.use(session);
handler.use(isUserLoggedIn);
handler.use(canUserEditTickets);
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
        const project_id = req.query.project_id;
        const project = await prisma.project.findUnique({
            where: {
                id: project_id,
            },
            select: {
                id: true,
                tags: true,
                details: true
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
            return res.status(409).json({
                errors: ['Ticket with that name already exists.']
            });
        }
        const project_details: any = project.details;
        if (!project_details.columns[status]) {
            return res.status(422).json({
                errors: ["Status doesn't exist."]
            });
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
                projectId: project.id,
            },
            select: {
                ticketNumber: true,
            },
            orderBy: {
                createdAt: 'asc'
            },
            take: 1
        });

        const ticket = await prisma.ticket.create({
            data: {
                userId: req.user.id,
                name: name,
                description: description,
                projectId: project.id,
                status: status,
                priority: mapIntToPriority(priority),
                assignedUserId: assignedUser ? assignedUser.id : null,
                timeEstimate: validateTime(estimate) || '0m',
                ticketNumber: (latestTicket && latestTicket[0]) ? latestTicket[0].ticketNumber + 1 : 1
            },
        });
        let newDetails = _.cloneDeep(project_details);
        newDetails.columns[status].ticketIds = [ ticket.id, ...newDetails.columns[status].ticketIds ]

        const updatedProject = await prisma.project.update({
            where: {
                id: project.id,
            },
            data: {
                details: newDetails
            }
        });

        console.log(project.tags, tags)

        const tagList = await prisma.tagTicketJunction.createMany({
            data: project.tags
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