const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')

const Product = require('./models/product');
const res = require('express/lib/response');

mongoose.connect('mongodb://localhost:27017/farmStand', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))

//HOME PAGE FOR EACH PRODUCT
app.get('/products', async(req, res) => {
    const products = await Product.find({})
    // console.log(products)
    res.render('products/index', { products });
})

//CREATING NEW PRODUCT
app.get('/products/new', (req,res) => {
    res.render('products/new')
})
app.post('/products', async(req,res) =>{
    // console.log(req.body)
    // res.send('making ur product')
    const newProduct = new Product(req.body);
    await newProduct.save();
    // console.log(newProduct);
    res.redirect(`/products/${newProduct._id}`)

})


//SHOW PAGE FOR EACH PRODUCT
app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    console.log(product);
    res.render('products/show', { product })
})

//UPDATING PRODUCT
app.get('/products/:id/edit', async(req, res) =>{
    const { id } = req.params;
    const product = await Product.findById(id)
    res.render('products/edit', { product });
})

app.put('/products/:id', async(req,res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    // console.log(req.body);
    // res.send('PUT!!')
    res.redirect(`/products/${product._id}`)
})

app.delete('/products/:id', async(req,res) => {
    // res.send("sdfs");
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products');
})

app.listen(3000, ()=>{
    console.log("Listening on port 3000");
})