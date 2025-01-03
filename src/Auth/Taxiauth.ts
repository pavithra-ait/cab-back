import { Request, Response } from 'express';
import { Taxi } from '../Modules/Taxi';
import { Driver } from '../Modules/Driver';


class TaxiController {
    async indexdata(req: Request, res: Response): Promise<void> {
        try {
            const taxi = await Taxi.findById(req.params._id);

            if (!taxi) {
                res.status(404).json({ error: 'Taxi not found.' });
                return;
            }

            res.status(200).json(taxi);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
    async getdata(req: Request, res: Response): Promise<void> {
        try {
            const taxi = await Taxi.find(req.body);
            res.status(200).json(taxi);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
    async createdata(req: Request, res: Response) {
        const files = req.file;
        try {
            if (!files) {
                return res.status(400).json({ error: 'Image file is required.' });
            }

            const { driverid } = req.body;


            if (!driverid) {
                return res.status(400).json({ error: 'Driver ID is required.' });
            }

            const driver = await Driver.findById(driverid);

            if (!driver) {
                return res.status(404).json({ error: 'Driver not found.' });
            }

            const newTaxi = await Taxi.create({
                taxiname: req.body.taxiname,
                taxibrand: req.body.taxibrand,
                taxiimage: files.filename,
                driverid: driver._id,
                drivername: driver.name,
                from: req.body.from,
                to: req.body.to,
                available: req.body.available
            });

            await newTaxi.save();
            return res.status(201).json(newTaxi);
        } catch (error) {
          return  res.status(500).json({ error: (error as Error).message });
        }
    }

    async deletedata(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const taxi = await Taxi.findByIdAndDelete(id);

            if (!taxi) {
                res.status(404).json({ error: 'Taxi not found.' });
                return;
            }

            res.status(200).json({ message: 'Taxi deleted successfully.' });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async avaliabledata(req: Request, res: Response): Promise<void> {
        try {
            const { available } = req.query;

            // Ensure availableStatus is only set when the query is valid
            let availableStatus = undefined;
            if (available === 'true') {
                availableStatus = true;
            }

            // Construct the query to fetch only available taxis
            const query = availableStatus !== undefined ? { available: availableStatus } : {};

            const check = await Taxi.find(query);
            res.status(200).json(check);
        } catch (err) {
            console.error(err);
            res.status(500).send('Error fetching taxis');
        }
    }
}

export default new TaxiController();