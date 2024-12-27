import { Request, Response } from "express";
import { User } from "../Modules/User";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'


class AuthController {

    public async userregister(req: Request, res: Response): Promise<Response> {
        try {
            const { name, email, password, city, mobile, address, gender } = req.body;

            if (!name || !email || !password || !city || !mobile || !address || !gender) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({ name, email, password: hashedPassword, city, mobile, address, gender });

            return res.status(201).json({ message: 'User registered successfully', newUser });
        } catch (error) {
            console.error('Error during registration:', error);
            return res.status(500).json({ message: 'Server error' });
        }

    }
    public async userlogin(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }


            if (!password || !user.password) {
                return res.status(400).json({ error: 'Password and hash are required' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {

                const token = jwt.sign({ id: user._id }, 'CrUd', { expiresIn: '1h' });
                return res.status(200).json({ message: 'Login successful', token ,datas:user});
            } else {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    public async usergetdata(req: Request, res: Response): Promise<Response> {
        try {
            const user = await User.find();
            return res.status(200).json(user);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Server error' });
        }
    }
}

export default new AuthController();
