const express = require('express');
const path = require('path');
const rootDir = require('./util/path');
const mongoose = require('mongoose');
const secrets = require('./util/secrets');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash =  require('connect-flash');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = `mongodb+srv://${secrets.mongoDbUser}:${secrets.mongoDbPassword}@cluster0-f8kmd.gcp.mongodb.net/shop`;

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
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            next(new Error(err));
        });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
    res.status(500)
        .render('500', { 
            pageTitle: 'Error', 
            path: '/500', 
            isAuthenticated: req.session.isLoggedIn
        });
});

mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true  })
    .then(result => {
        app.listen(3000);
    })
    .catch(err => console.log(err));