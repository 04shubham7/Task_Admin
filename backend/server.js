const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {json} = require('express');
const {User, Task} = require('./models/Task'); //Importing models to sync with database
const sequelize = require('./config/database');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });
const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//Test Routes
app.get('/', (req, res) => {
  res.send('Task Manager API is up and running');
});

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