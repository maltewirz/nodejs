const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const path = require('path');
const rootDir = require('./util/path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(rootDir, 'public')));

app.use((req, res, next) => {
    User.findById('5e3e5d032310b19751db04c3')
        .then(user => {
            req.user = new User(user.name, user.email, user.cart, user._id);
            next();
        })
        .catch(err => {
            console.log(err);
        });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
    
    app.listen(3000);
});