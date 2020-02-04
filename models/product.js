const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const Cart = require('./cart');

const pathDisk = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = (cb) => {
    fs.readFile(pathDisk, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
};


module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile(products => {
            if (this.id) {           
                // console.log(products);
                     
                const existingProductIndex = products.findIndex(
                    prod => prod.id === this.id);                
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(pathDisk, JSON.stringify(updatedProducts), err => {
                    console.log(err);
                });
            } else {
                this.id = Math.floor(Math.random() *10000).toString();
                products.push(this);
                fs.writeFile(pathDisk, JSON.stringify(products), 
                    err => console.log(err));
            }
        });
    }

    static deleteById(id) {        
        getProductsFromFile(products => {
            const product = products.find(prod => prod.id === id);
            const productsUpdated = products.filter(p => p.id !== id);
            fs.writeFile(pathDisk, JSON.stringify(productsUpdated), err => {
                if (!err) {
                    Cart.deleteProduct(id, product.price);
                }
            });
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            cb(product);
        });
    }
};