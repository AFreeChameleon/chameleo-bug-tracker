import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import multer from 'multer';
import * as yup from 'yup';
import bcrypt from 'bcrypt';
import timestring from 'timestring';
import { prisma }  from '../../../lib/prisma';
import withSession, { NextApiRequestWithSession, session } from '../../../lib/session';
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
    try {
        console.log('new ticket', req.files, req.file, req.body)

        // const data = await new Promise((resolve, reject) => {
        //     const form = formidable({
        //         multiples: true,
        //     });
        //     console.log('form')
        //     form.parse(req, (err, fields, files) => {
        //         console.log('formparse')
        //         if (err) {
        //             console.log(err)
        //             reject({ err })
        //         }
        //         console.log('fields & files', fields, files)
        //         resolve({ err, fields, files });
        //     });
        // });
        // console.log(data)


        // const {
        //     name,
        //     description,
        //     tags,
        //     project_company,
        //     status,
        //     priority,
        //     assignedTo,
        //     estimate,
        //     attachments
        // } = schema.validateSync(data);
        // const project = await prisma.project.findUnique({
        //     where: {
        //         company: project_company
        //     },
        //     select: {
        //         id: true
        //     }
        // });
        // if (!project) {
        //     return res.status(404).json({
        //         errors: ['Project doesn\'t exist.']
        //     })
        // }
        // const existingTicket = await prisma.ticket.findMany({
        //     where: {
        //         name: name
        //     }
        // });
        // if (existingTicket.length > 0) {
        //     return res.status(404).json({
        //         errors: ['Ticket with that name already exists.']
        //     })
        // }

        // const assignedUser = await prisma.user.findUnique({
        //     where: {
        //         email: assignedTo
        //     },
        //     select: {
        //         id: true
        //     }
        // });

        // const ticket = await prisma.ticket.create({
        //     data: {
        //         userId: req.user.id,
        //         name: name,
        //         description: description,
        //         projectId: project.id,
        //         status: mapIntToStatus(status),
        //         priority: mapIntToPriority(priority),
        //         assignedUserId: assignedUser ? assignedUser.id : null,
        //         timeEstimate: validateTime(estimate) || '0m'
        //     },
        // });

        // const tagList = await prisma.tag.createMany({
        //     data: tags.map((tag) => ({
        //         name: tag.name,
        //         ticketId: ticket.id,
        //         projectId: project.id
        //     }))
        // })

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

// export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
//     switch (req.method) {
//         case 'POST':
//             isUserLoggedIn(req, res, postNewTicket);
//             break;
//         default:
//             res.status(404).json({
//                 errors: ['Could not find route specified.']
//             });
//             break;
//     }
// });
