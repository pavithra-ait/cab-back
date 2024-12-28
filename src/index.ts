import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import connectdb from './DB/Db';
import userroute from './Route/usercontroller';
import driverroute from './Route/driverroute';
import taxiroute from './Route/taxiroute';
import bookroute from './Route/Booking';
import paymentroute from './Auth/paymentauth';

const app = express();
const port = 4001;

const corsorigin = {
    origin: 'http://localhost:3000'
}

connectdb()
app.use(cors(corsorigin))
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/user', userroute);
app.use('/api/driver', driverroute);
app.use('/api/taxi', taxiroute);
app.use('/api/book', bookroute);
app.use('/api/payment', paymentroute);


app.listen(port, () => {
    return console.log(`Express is listening at ${port}`);
});