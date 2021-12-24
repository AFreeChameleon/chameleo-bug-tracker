import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import axios from 'axios';
import * as yup from 'yup';
import bcrypt from 'bcrypt';
import { prisma }  from '../../../../lib/prisma';
import { getProject } from '../../../../lib/db';
import withSession, { NextApiRequestWithSession, NextApiRequestWithSessionRole, session } from '../../../../lib/session';
import { isUserLoggedIn, isUserLoggedInWithRole } from '../../../../middleware/auth';
import { canUserReadTickets } from '../../../../middleware/permissions';
import { generateAPIKey } from '../../../../lib/api';

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

handler.get(async (req: NextApiRequestWithSessionRole, res: NextApiResponse) => {
    try {
        const project_id = req.query.project_id as string;
        const keyRes: any = await axios.post(`${process.env.API_URL}/api-key`, {
            user_id: req.user.id,
            project_id: project_id,
        }, {
            headers: {
                'X-API-KEY': process.env.API_PASSWORD
            }
        });
        return res.json({
            key: keyRes.data.key
        });
    } catch (err) {
        console.log(err);
        if (err.errors) {
            return res.status(500).json({
                errors: err.errors
            });
        }
        return res.status(500).json({
            errors: ['An error occurred while getting project details, please try again later.']
        })
    }
});

export default handler;