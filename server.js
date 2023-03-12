import express from 'express';
import cors from 'cors';
import morgan from 'morgan';//used to login all the http request inside the console
import connect from './database/conn.js';
import router from './router/route.js';

import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** middlewares */
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by'); // less hackers know about our stack


const port = process.env.PORT || 4000;

/** HTTP GET Request */
app.get('/', (req, res) => {
    res.status(201).json("Home GET Request");
});


/** api routes */
app.use('/api', router)

//statics files
app.use(express.static(path.join(__dirname, "./client/build")));

app.get('*' , (req,res) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
})

/** start server only when we have valid connection */
connect().then(() => {
    try {
        app.listen(port, () => {
            console.log(`Server connected to http://localhost:${port}`);
        })
    } catch (error) {
        console.log('Cannot connect to the server')
    }
}).catch(error => {
    console.log("Invalid database connection...!");
})

