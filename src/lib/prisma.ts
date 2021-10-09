import { PrismaClient } from "@prisma/client";

export let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    if (!global.prismaClient) {
        global.prismaClient = new PrismaClient();
    }
    prisma = global.prismaClient;
}