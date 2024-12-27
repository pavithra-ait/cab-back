import express, { NextFunction, Request, Response } from "express";
import Drivercontroller from '../Auth/driverauth'

const router = express.Router();

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {

    try {
        await Drivercontroller.register(req, res)
    }
    catch (err) {
        next(err)
    }
})

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {

    try {
        await Drivercontroller.login(req, res)
    }
    catch (err) {
        next(err)
    }
})


router.get('/all', async (req: Request, res: Response, next: NextFunction) => {

    try {
        await Drivercontroller.getdata(req, res)
    }
    catch (err) {
        next(err)
    }
})



router.get('/all/:_id', async (req: Request, res: Response, next: NextFunction) => {

    try {
        await Drivercontroller.getdatabyid(req, res)
    }
    catch (err) {
        next(err)
    }
})




export default router;