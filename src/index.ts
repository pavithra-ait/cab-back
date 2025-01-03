import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import connectdb from './DB/Db';
import userroute from './Route/usercontroller';
import driverroute from './Route/driverroute';
import taxiroute from './Route/taxiroute';
import paymentroute from './Route/paymentroute';


const app = express();
const port = 4242;

connectdb()

app.use(cors({
    origin: 'http://localhost:3000' 
}));

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api/user', userroute);
app.use('/api/driver', driverroute);
app.use('/api/taxi', taxiroute);
app.use('/api', paymentroute);



app.listen(port, () => {
    return console.log(`Express is listening at ${port}`);
});