const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./configs/db');
const cookieParser = require('cookie-parser');
const errorHandler = require('./src/errors/api-error-handler');
const bodyParser = require('body-parser');


// Initializing environment vairables
dotenv.config({
    path: './configs/config.env'
});

// Connect to mangodb database
connectDB();


const app = express()

// Routes files
const shoesRoutes = require('./src/routes/shoe');
const userRoutes = require('./src/routes/users');
const authRoutes = require('./src/routes/auth');
const cartRoutes = require("./src/routes/cart.route");
const salesRoutes = require("./src/routes/sales");


app.use(
    cors({origin: ['*', 'http://localhost:3000'],
        methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
        optionsSuccessStatus: 200,
        credentials: true 
    })
  );

  
// app.use((req,res,next)=>{
//     res.setHeader('Access-Control-Allow-Origin',['http://localhost:3000','*']);
//     res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
//     res.setHeader('Access-Control-Allow-Methods','Content-Type Authorization Origin X-Requested-With Accept');
//     res.setHeader('Access-Control-Allow-Credentials', 'true')
//     next(); 
// })


// Body parser
app.use(express.json());

// Cookies parser
app.use(cookieParser())

app.use(bodyParser.json())

// Using morgan
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Adding routes middlewares
app.use('/api/v1/shoes', shoesRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/cart',cartRoutes);
app.use('/api/v1/sales',salesRoutes);




// Error handler 
app.use(errorHandler);


// Environment variables 
const PORT = process.env.PORT || 5000;
const ENVIRONMENT = process.env.NODE_ENV;

const server = app.listen(PORT, () => {
    console.log(`Server Running in ${ENVIRONMENT} PORT ${PORT}. Link: http://localhost:${PORT}/`.yellow.bold)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Unhandled Rejection: ${err.message}`.red);
    // Close server and Exit process
    server.close(() => process.exit(1))
})