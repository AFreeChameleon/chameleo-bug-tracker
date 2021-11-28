import { NextApiRequest, NextApiResponse } from 'next';
import _ from 'lodash';
import nextConnect from 'next-connect';
import * as yup from 'yup';
import bcrypt from 'bcrypt';
import { prisma }  from '../../../../../lib/prisma';
import withSession, { NextApiRequestWithSessionRole, session } from '../../../../../lib/session';
import { isUserLoggedInWithRole } from '../../../../../middleware/auth';

const schema = yup.object().shape({
    column_id: yup.string()
        .required('Column ID is required.'),
    method: yup.string()
        .required('Method is required.'),
    backup_column_id: yup.string()
        .optional().nullable()
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

handler.post(async (req: NextApiRequestWithSessionRole, res: NextApiResponse) => {
    try {
        const { 
            column_id, 
            method, 
            backup_column_id
        } = schema.validateSync(req.body);
        const project_id = req.query.project_id as string;
        let editableDetails = _.cloneDeep(req.user.projects[0].details);
        if (editableDetails.columns[column_id].ticketIds.length > 0) {
            if (method === '0') {
                editableDetails.columns[backup_column_id].ticketIds = [ 
                    ...editableDetails.columns[backup_column_id].ticketIds, 
                    ...editableDetails.columns[column_id].ticketIds 
                ];
            } else if (method === '1') {
                await prisma.ticket.updateMany({
                    where: {
                        OR: editableDetails
                        .columns[column_id]
                        .ticketIds.map((t) => ({
                            id: t
                        }))
                    },
                    data: {
                        archived: true
                    }
                });
            }
        }
        editableDetails.columnOrder = editableDetails.columnOrder.filter(c => c !== column_id);
        editableDetails.columns = _.omit(editableDetails.columns, [column_id]);
        const project = await prisma.project.update({
            where: {
                id: project_id
            },
            data: {
                details: editableDetails
            },
            select: {
                name: true,
                id: true,
                details: true,
                tickets: {
                    select: {
                        id: true,
                        timeEstimate: true,
                        status: true,
                        priority: true,
                        description: true,
                        name: true,
                        user: {
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true
                            }
                        },
                        assignedUserId: true,
                        source: true,
                        started: true,
                        createdAt: true,
                        updatedAt: true,
                        ticketNumber: true
                    },
                },
                roles: {
                    where: {
                        userId: req.user.id
                    }
                },
                tags: {
                    select: {
                        id: true,
                        name: true,
                        createdAt: true,
                        updatedAt: true
                    }
                },
                updatedAt: true,
                createdAt: true,
                user: { 
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true
                    }
                },
                users: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                createdAt: true,
                                updatedAt: true,
                            }
                        }
                    }
                }
            }
        });
        return res.json({
            project: project,
        });
    } catch (err) {
        console.log(err);
        if (err.errors) {
            return res.status(500).json({
                errors: err.errors
            });
        }
        return res.status(500).json({
            errors: ['An error occurred while deleting this column, please try again later.']
        })
    }
});

export default handler;