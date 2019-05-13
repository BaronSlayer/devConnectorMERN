const express = require('express');
const users = require('./routes/api/usersApi');
const auth = require('./routes/api/authApi');
const profile = require('./routes/api/profileApi');
const posts = require('./routes/api/postsApi');
const connectDB = require('./config/db')

const app = express();

// connect database
connectDB();

// init middleware
app.use(express.json({
    extended: false
}));

app.get('/', (request, response) => response.send('API Running'));

// Define Routes
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
