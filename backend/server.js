const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {json} = require('express');
const {User, Task} = require('./models/Task'); //Importing models to sync with database
const sequelize = require('./config/database');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const taskRoutes = require('./routes/taskRoutes'); // Import task routes
const userRoutes = require('./routes/userRoutes'); // Import user routes

dotenv.config({ path: path.resolve(__dirname, '.env') });
const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:5174').split(',').map(origin => origin.trim()).filter(Boolean);

//Middleware
app.use(cors({
    origin: allowedOrigins.length ? allowedOrigins : true,
    credentials: true,
}));
app.use(express.json());

//Test Routes
app.get('/', (req, res) => {
  res.send('Task Manager API is up and running');
});

//Routes Setup
app.use('/api/auth', authRoutes); // mounting auth routes
app.use('/api/tasks', taskRoutes); // mounting task routes
app.use('/api/users', userRoutes); // mounting user routes

//Database Sync & Server Start
const port = process.env.PORT || 5000;
sequelize.sync({alter:true}).then(() => {
    console.log('Database connected and synced successfully');
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch(err => {
    console.error('Error syncing database:', err);
});