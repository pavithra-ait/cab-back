import express, { NextFunction, Request, Response } from "express";
import Authcontroller from '../Auth/userauth'

const router = express.Router();

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {

    try {
        await Authcontroller.userregister(req, res)
    }
    catch (err) {
        next(err)
    }
})

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {

    try {
        await Authcontroller.userlogin(req, res)
    }
    catch (err) {
        next(err)
    }
})

router.get('/all', async (req: Request, res: Response, next: NextFunction) => {

    try {
        await Authcontroller.usergetdata(req, res)
    }
    catch (err) {
        next(err)
    }
})



export default router;