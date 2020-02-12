const express = require('express');
const path = require('path');
const rootDir = require('./util/path');
const mongoose = require('mongoose');
const dbCredentials = require('./util/dbCredentials');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash =  require('connect-flash');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = `mongodb+srv://${dbCredentials.user}:${dbCredentials.password}@cluster0-f8kmd.gcp.mongodb.net/shop`;

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(rootDir, 'public')));
app.use(session({ 
    secret: 'my test secret', 
    resave: false, 
    saveUninitialized: false,
    store: store
}));
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        });
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true  })
    .then(result => {
        app.listen(3000);
    })
    .catch(err => console.log(err));