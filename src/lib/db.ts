import bcrypt from 'bcrypt';
import { prisma }  from './prisma';
export const salt = bcrypt.genSaltSync(10);

export const getProject = async (projectId: string, userId: number) => {
    const project = await prisma.project.findUnique({
        where: {
            id: projectId
        },
        select: {
            name: true,
            id: true,
            details: true,
            tickets: {
                where: {
                    archived: false
                },
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
                    ticketNumber: true,
                    tags: {
                        select: {
                            tag: true,
                        }
                    }
                },
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
                            roles: {
                                where: {
                                    projectId: projectId
                                },
                                select: {
                                    projectId: true,
                                    userId: true,
                                    role: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    const archivedTickets = await prisma.ticket.findMany({
        where: {
            projectId: projectId,
            archived: true
        },
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
    });

    return {
        ...project,
        archivedTickets: [
            ...archivedTickets
        ]
    };
}

export const getTicket = async (projectId: string, ticketNumber: number) => {
    const ticket: any = await prisma.ticket.findFirst({
        where: {
            projectId: projectId,
            ticketNumber: ticketNumber,
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
            comments: {
                select: {
                    id: true,
                    message: true,
                    createdAt: true,
                    updatedAt: true,
                    user: {
                        select: {
                            id: true,
                            lastName: true,
                            firstName: true,
                            email: true,
                            createdAt: true,
                            updatedAt: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            },
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