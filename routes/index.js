var express = require('express');
var router = express.Router();
var Product = require("../models/product");
var Cart = require("../models/cart");
/* GET home page. */
router.get('/', function (req, res, next) {
  Product.find(function (err, docs) {
    var productchunk = [],
      chunksize = 3;
    for (var i = 0; i < docs.length; i += chunksize) {
      productchunk.push(docs.slice(i, i + chunksize))
    }
    res.render('shop/index', {
      products: productchunk
    });
  });
});

router.get("/add-to-cart/:id", function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function (err, product) {
    if (err) {
      return res.redirect("/");
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    res.redirect("/")
  })
});

router.get("/cart", function (req, res, next) {
  if (!req.session.cart) {
    return res.render("shop/cart", {
      products: null
    })
  }
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  res.render("shop/cart", {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice
  });
});

router.get("/cart/remove/:id", function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.remove(productId);
  req.session.cart = cart;
  res.redirect("/cart");
});

router.post("/cart/update/:id", function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var qty = parseInt(req.body.updatedqty);
  if (qty > 0) {
    cart.update(productId, qty);
    req.session.cart = cart;
  }
  res.redirect("/cart");
});
module.exports = router;