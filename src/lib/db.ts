import bcrypt from 'bcrypt';
import { prisma }  from './prisma';
export const salt = bcrypt.genSaltSync(10);

export const getTicket = async (projectId: string, ticketNumber: number) => {
    const ticket: any = await prisma.ticket.findFirst({
        where: {
            projectId: projectId,
            ticketNumber: ticketNumber
        },
        select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
            projectId: true,
            description: true,
            timeEstimate: true,
            ticketNumber: true,
            status: true,
            priority: true,
            started: true,
            archived: true,
            assignedUserId: true,
            user: {
                select: {
                    id: true,
                    lastName: true,
                    firstName: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true
                }
            },
            tags: {
                select: {
                    tag: {
                        select: {
                            name: true,
                        }
                    }
                }
            }
        }
    });

    if (ticket && ticket.assignedUserId) {
        ticket.assignedUser = await prisma.user.findUnique({
            where: {
                id: ticket.assignedUserId
            },
            select: {
                id: true,
                lastName: true,
                firstName: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }

    return ticket;
}