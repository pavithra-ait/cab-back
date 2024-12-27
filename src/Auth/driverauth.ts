import { Request, Response } from "express";
import { Driver } from '../Modules/Driver'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'


class DriverController {

    public async register(req: Request, res: Response): Promise<Response> {
        try {
            const { name, email, password, city, mobile, address, gender,licence } = req.body;

            if (!name || !email || !password || !city || !mobile || !address || !gender||!licence) {
                return res.status(400).json({ message: 'All fields are required' });
            }


            const hashedPassword = await bcrypt.hash(password, 10);
            const newDriver = await Driver.create({ name, email, password: hashedPassword, city, mobile, address, gender,licence });

            return res.status(201).json({ message: 'Driver registered successfully', newDriver });
        } catch (error) {
            console.error('Error during registration:', error);
            return res.status(500).json({ message: 'Server error' });
        }

    }
    public async login(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body;

            const driver = await Driver.findOne({ email });
            if (!driver) {
                return res.status(400).json({ message: 'User not found' });
            }


            if (!password || !driver.password) {
                return res.status(400).json({ error: 'Password and hash are required' });
            }

            const isMatch = await bcrypt.compare(password, driver.password);

            if (isMatch) {

                const token = jwt.sign({ id: driver._id }, 'CrUd', { expiresIn: '1h' });
                return res.status(200).json({ message: 'Login successful', token });
            } else {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    public async getdata(req: Request, res: Response): Promise<Response> {

        try {
            const data = await Driver.find(req.body);
            return res.status(200).json(data);
        }
        catch {
            return res.status(500).json("server error");
        }

    }
    public async getdatabyid(req: Request, res: Response): Promise<Response> {

        try {
            const data = await Driver.findById(req.params._id);
            return res.status(200).json(data);
        }
        catch {
            return res.status(500).json("server error");
        }

    }
}

export default new DriverController();