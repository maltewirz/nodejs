const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const path = require('path');
const rootDir = require('./util/path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(rootDir, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

sequelize.sync()
    .then(result => {
        // console.log(result);
        app.listen(3000,() => {
            console.log('Server listens');
        });
    })
    .catch(err => {
        console.log(err);
    });



