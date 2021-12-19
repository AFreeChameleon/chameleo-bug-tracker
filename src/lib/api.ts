import bcrypt from 'bcrypt';
import rsa from 'node-rsa';
import fs from 'fs';
import { prisma } from './prisma';

const publicKey = new rsa();
const privateKey = new rsa();

const publicKeyContent = fs.readFileSync(`${process.cwd()}/security/public.pem`, 'utf8');
const privateKeyContent = fs.readFileSync(`${process.cwd()}/security/private.pem`, 'utf8');

publicKey.importKey(publicKeyContent);
privateKey.importKey(privateKeyContent);

export const generateAPIKey = (userId: string, projectId: string) => {
    const firstSalt = bcrypt.genSaltSync(10);
    const lastSalt = bcrypt.genSaltSync(10);

    // Base64 doesn't use full stops
    const encrypted = privateKey.encryptPrivate(`${firstSalt}.${userId}.${projectId}.${lastSalt}`, 'base64');
    
    return encrypted;
}

export const getUserFromAPIKey = async (key: string) => {
    const decrypted = publicKey.decryptPublic(key, 'utf8');

    const [f, userId, projectId, l] = decrypted.split('.');

    if (!(f && userId && projectId && l)) {
        return null;
    }

    const user = await prisma.user.findUnique({
        where: {
            id: parseInt(userId)
        },
        select: {
            id: true,
            projects: {
                where: {
                    id: projectId
                }
            }
        }
    });

    return user;
}