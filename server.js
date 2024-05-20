var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/swag-shop');

var Product = require('./model/product');
var WishList = require('./model/wishlist');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/*app.post('/product', function(request, response){
    //var product = new Product(request.body);
    var product = new Product();
    product.title = request.body.title;
    product.price = request.body.price;
    product.save(function(err, savedProduct){
        if (err) {
            response.status(500).send({error:"Could not save product"});
        }else{
            response.send(savedProduct);
        }
    });
});*/

app.post("/product", async (request, response) => {
    var product = new Product();
    product.title = request.body.title;
    product.price = request.body.price;
    try {
      await product.save();
      response.send(product);
    } catch (err) {
      response.status(500).send({error:"Could not save product"});
    }
});

app.get("/product", async (request, response) => {
    try {
        const products = await Product.find({});
        response.send(products);
    } catch (err) {
        response.status(500).send({error:"Could not fetch products"});
    }
});

app.post("/wishList", async (request, response) => {
    var wishList = new WishList();
    wishList.title = request.body.title;
    try {
        await wishList.save();
        response.send(wishList);
    } catch (err) {
        response.status(500).send({error:"Could not save wishlist"});
    }
});

app.get("/wishlist", async (request, response) => {
    try {
        const wishLists = await WishList.find({}).populate({path:'products', model: 'Product'}).exec();
        response.send(wishLists);
    } catch (err) {
        response.status(500).send({error:"Could not fetch wishlists"});
    }
});

/*app.get('/product', function(request, response){
    Product.find({},function(err, products){
        if (err) {
            response.status(500).send({error: "Could not fetch products"});
        }else{
            response.send(products);
        }
    });
});*/

/*app.put('/wishlist/product/add', function(request, response){
    Product.findOne({_id: request.body.productId}, function(err, product){
        if (err){
            response.status(500).send({error:"Could not add product to wishlists"});
        }else{
            WishList.update({_id: request.body.wishListId}, {$addToSet:{products:product._id}}, function(err, wishList) {
                if (err){
                    response.status(500).send({error:"Could not add product to wishlists"});
                }else{
                    response.send(wishList);
                }
            });
        }
    });
});*/


app.put("/wishlist/product/add", async (request, response) => {
    try {
        var product = await Product.findOne({_id: request.body.productId});
        //response.send(wishLists);

        try {
            /*const x = await WishList.updateOne(
                { _id: request.body.wishListId },
                { $addToSet: { products: product._id } }
            );

            if (x.modifiedCount === 1) {
                response.send(x);
            } else {
                response.status(500).send({error:"Could not add product to wishlists 05"});
            }*/
            const x = await WishList.updateOne({_id: request.body.wishListId}, {$addToSet:{products:product._id}});
            response.send("Successfully added to WishList");
        }catch (err) {
            response.status(500).send({error:"Could not add product to wishlists 03"});
        }    
    } catch (err) {
        response.status(500).send({error:"Could not add product to wishlists 01"});
    }
});

app.listen(3000, function(){
    console.log("Swag shop API running on port 3000...");
});

