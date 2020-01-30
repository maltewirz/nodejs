const express = require('express');
const app = express();

app.use(express.urlencoded({extended: false}));

app.use('/', (req, res, next) => {
    next();
});

app.use('/add-product', (req, res, next) => {
    res.send('<html><form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form></html>');
});

app.use('/product', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

app.use('/', (req, res, next) => {
    res.send('<html>Express Server here</html>');
});

app.listen(3000,() => {
    console.log('Server listens');
});

