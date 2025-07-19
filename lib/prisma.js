"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
var prisma_1 = require("../app/generated/prisma");
var globalForPrisma = global;
exports.prisma = globalForPrisma.prisma ||
    new prisma_1.PrismaClient();
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = exports.prisma;
