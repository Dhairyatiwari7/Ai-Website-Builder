import { Request } from "express";
import { Interface } from "node:readline";

declare global {
    namespace Express {
        interface Request{
            userId?: string
        }
    }
}