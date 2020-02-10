const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dbCredentials = require('./util/dbCredentials');

app.set('view engine', 'ejs');
app.set('views', 'views');

const errorController = require('./controllers/error');
// const User = require('./models/user');

const path = require('path');
const rootDir = require('./util/path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(rootDir, 'public')));

// app.use((req, res, next) => {
//     User.findById('5e3e5d032310b19751db04c3')
//         .then(user => {            
//             req.user = new User(user.name, user.email, user.cart, user._id);
//             next();
//         })
//         .catch(err => {
//             console.log(err);
//         });
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
    .connect(`mongodb+srv://${dbCredentials.user}:${dbCredentials.password}@cluster0-f8kmd.gcp.mongodb.net/shop?retryWrites=true&w=majority`)
    .then(result => {
        app.listen(3000);
    })
    .catch(err => console.log(err));