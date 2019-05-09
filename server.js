const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const passport = require('passport');

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

// Body parser middleware
// app.use(bodyParser.urlencoded({
//     extended: false
// }));
// app.use(bodyParser.json());

// DB Config
// const db = require('./config/keys').mongoURI;

// Connect to MongoDB
// mongoose.connect(db, {
//         useNewUrlParser: true
//     })
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.log(err));

// Passport middleware
// app.use(passport.initialize());

// Passport config
// require('./config/passport')(passport);

// Define Routes
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));