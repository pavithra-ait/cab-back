import express, { Request, Response } from 'express';
import multer from 'multer';
import TaxiController from '../Auth/Taxiauth';
import { Taxi } from '../Modules/Taxi';
import { Driver } from '../Modules/Driver';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });
router.use('/view', express.static(path.join(__dirname, 'uploads')));

router.get('/find', TaxiController.getdata);


router.post('/create', upload.single('taxiimage'), async (req: Request, res: Response) => {
    const file = req.file as File | undefined;

    if (file) {
        console.log(file);
        await TaxiController.createdata(req, res);
    } else {
        res.status(400).send('No file uploaded');
    }
});


router.get('/find/:_id', TaxiController.indexdata);
router.get('/available', TaxiController.avaliabledata);

router.delete('/remove/:id', TaxiController.deletedata);

router.put('/update/:id', upload.single('taxiimage'), async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { taxiname, taxibrand, from, to } = req.body;
    const image = req.file;

    if (!id  || !taxiname || !taxibrand || !from || !to) {
        res.status(400).json({ error: "Missing required fields" });
        return;
    }

    try {

        const taxi = await Taxi.findById(id);
        if (!taxi) {
            res.status(404).json({ error: "Product not found" });
            return;
        }

        const { driverid } = req.body;


        if (!driverid) {
            res.status(400).json({ error: 'Driver ID is required.' });
            return;
        }

        const driver = await Driver.findById(driverid);

        if (!driver) {
            res.status(404).json({ error: 'Driver not found.' });
            return;
        }

        taxi.taxiname = taxiname;
        taxi.taxibrand = taxibrand;
        taxi.driverid = driver._id;
        taxi.drivername = driver.name;
        taxi.from = from;
        taxi.to = to;

        if (image) {
            taxi.taxiimage = image.filename;
        }

        await taxi.save();
        res.status(200).json({ message: "taxi updated successfully", taxi });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
