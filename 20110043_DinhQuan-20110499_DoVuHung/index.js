var express = require('express')

var ejs = require('ejs')

var app = express()
var session = require('express-session')

var bodyParser = require('body-parser')
var mysql = require('mysql');
var paypal = require('paypal-rest-sdk');
const res = require('express/lib/response')

const connect = mysql.createConnection({
    host:"us-cdbr-east-06.cleardb.net",
    user:"b060c3fa72ae89",
    password:"0e6af735",
    database:"heroku_9921352427430fd"
})



app.listen(8080); 

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(session({
    secret: "secret"
}));

app.set('view engine','ejs');
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AaZsTHkpdn_ojGBOtGN2LDqJX9DoL_IbgcL-4Mc5uJKHGwmoT79oEl0e6E1204ctfnYm7r_h5zHYfJGz',
    'client_secret': 'EGbOKSBCLeFczwIZ3jxbz2nqsuCJdZaNdCDomO7pPkccBoMt8C5jxi3EfTGmJj76kcQdg7_uJeVXLMr6'
  });

function isProductInCart(cart,id){
    for(let i =0; i<cart.length; i++){
        if(cart[i].id == id){
            return true 
        }
    }
    return false
}

function calculateTotal(cart, req){
    total = 0
    for(let i =0; i<cart.length; i++){
        total = total + (cart[i].price*cart[i].quantity);
    }

    req.session.total = total;
    return total;
}
function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}
 
Date.prototype.toMysqlFormat = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};

//localhost:8080

app.get('/', function(req,res){
    var name = req.session.user_name;
    var con = mysql.createConnection({
        host:"us-cdbr-east-06.cleardb.net",
        user:"b060c3fa72ae89",
        password:"0e6af735",
        database:"heroku_9921352427430fd"
    })

    con.connect(function(error){
        if(error){
            throw error;
        }
        else{
            console.log("Connect successfully")
        }
    })

    con.query("SELECT * FROM heroku_9921352427430fd.product LIMIT 8",(err,result)=>{

        res.render('pages/index', {result:result,session:req.session,name:name});
    })
    

})

app.get('/kit', function(req,res){
    var name = req.session.user_name;
    var con = mysql.createConnection({
        host:"us-cdbr-east-06.cleardb.net",
        user:"b060c3fa72ae89",
        password:"0e6af735",
        database:"heroku_9921352427430fd"
    })
    
    con.connect(function(error){
        if(error){
            throw error;
        }
        else{
            console.log("Connect successfully")
        }
    })

    con.query('SELECT * FROM heroku_9921352427430fd.product where category = "Kit" LIMIT 9',function(err,result){
        res.render('pages/shop', {result:result,session:req.session,name:name});
    })
})

app.get('/keycap', function(req,res){
    var name = req.session.user_name;
    var con = mysql.createConnection({
        host:"us-cdbr-east-06.cleardb.net",
        user:"b060c3fa72ae89",
        password:"0e6af735",
        database:"heroku_9921352427430fd"
    })
    con.connect(function(error){
        if(error){
            throw error;
        }
        else{
            console.log("Connect successfully")
        }
    })

    con.query('SELECT * FROM heroku_9921352427430fd.product where category = "Keycap" LIMIT 9',function(err,result){
        res.render('pages/shop', {result:result,session:req.session,name:name});
    })
})

app.get('/switch', function(req,res){
    var name = req.session.user_name;
    var con = mysql.createConnection({
        host:"us-cdbr-east-06.cleardb.net",
        user:"b060c3fa72ae89",
        password:"0e6af735",
        database:"heroku_9921352427430fd"
    })
    con.connect(function(error){
        if(error){
            throw error;
        }
        else{
            console.log("Connect successfully")
        }
    })

    con.query('SELECT * FROM heroku_9921352427430fd.product where category = "Switch" LIMIT 9',function(err,result){
        res.render('pages/shop', {result:result,session:req.session,name:name});
    })
})

app.get('/stab', function(req,res){
    var name = req.session.user_name;
    var con = mysql.createConnection({
        host:"us-cdbr-east-06.cleardb.net",
        user:"b060c3fa72ae89",
        password:"0e6af735",
        database:"heroku_9921352427430fd"
    })
    con.connect(function(error){
        if(error){
            throw error;
        }
        else{
            console.log("Connect successfully")
        }
    })

    con.query('SELECT * FROM heroku_9921352427430fd.product where category = "Stab" LIMIT 9',function(err,result){
        res.render('pages/shop', {result:result,session:req.session,name:name});
    })
})
app.get('/shop', function(req,res){
    var name = req.session.user_name;
    var con = mysql.createConnection({
        host:"us-cdbr-east-06.cleardb.net",
        user:"b060c3fa72ae89",
        password:"0e6af735",
        database:"heroku_9921352427430fd"
    })
    con.connect(function(error){
        if(error){
            throw error;
        }
        else{
            console.log("Connect successfully")
        }
    })
    
    con.query("SELECT * FROM heroku_9921352427430fd.product LIMIT 9",(err,result)=>{

        res.render('pages/shop', {result:result,session:req.session,name:name});
    })

})

app.get("/login", function(req,res){
    res.render('pages/login');
})

app.get("/register", function(req,res){
    res.render('pages/registration');
})


app.post("/register", function(req,res){
    var email = req.body.email
    var password = req.body.psw;
    var re_password = req.body.psw_repeat;
    var name = req.body.name;
    if (password ==re_password){
        var con = mysql.createConnection({
            host:"us-cdbr-east-06.cleardb.net",
            user:"b060c3fa72ae89",
            password:"0e6af735",
            database:"heroku_9921352427430fd"
            
        })
        con.connect(function(error){
            if(error){
                throw error;
            }
            else{
                console.log("Connect successfully")
            }
        })  
    
    
        con.query(`INSERT INTO heroku_9921352427430fd.users ( uname, upwd, uemail) VALUES ( '${name}', '${password}', '${email}');`,function(err,result){
          
                res.redirect("/login");// res.render('pages/index', {result:result});
           
            
        })

    }

        
})

app.post("/login", function(req,res){
    let email = req.body.uemail;
    let password = req.body.psw;
    console.log(email);
    console.log(password);

    var con = mysql.createConnection({
        host:"us-cdbr-east-06.cleardb.net",
        user:"b060c3fa72ae89",
        password:"0e6af735",
        database:"heroku_9921352427430fd"
        
    })
    con.connect(function(error){
        if(error){
            throw error;
        }
        else{
            console.log("Connect successfully")
        }
    })  


    con.query(`SELECT * FROM heroku_9921352427430fd.users where uemail = '${email}' and upwd='${password}'`,function(err,result){
        console.log(result);
        if(result!=null){
            for(let i=0;i<result.length;i++){
                req.session.user_id = result[i].id;
                req.session.user_name = result[i].uname;
            }
            res.redirect("/");// res.render('pages/index', {result:result});
        }
        console.log(req.session.user_id);
        console.log(req.session.uesr_name);
    })
    
})

app.post('/search', function(req,res){
    
    req.session.nameproduct = req.body.nameproduct
    console.log(req.session.nameproduct)

    res.redirect('/result')
})

app.get('/result',function(req,res){
    var name = req.session.user_name;
    var con = mysql.createConnection({
        host:"us-cdbr-east-06.cleardb.net",
        user:"b060c3fa72ae89",
        password:"0e6af735",
        database:"heroku_9921352427430fd"
    })
    con.connect(function(error){
        if(error){
            throw error;
        }
        else{
            console.log("Connect successfully")
        }
    })

    con.query(`SELECT * FROM heroku_9921352427430fd.product where nameproduct LIKE '%${req.session.nameproduct}%'`,(err,result)=>{

        console.log(result)
        res.render('pages/shop', {result:result,session:req.session,name:name});
    })
})

app.post('/addToCart', function(req,res){
    var id = req.body.id;
    var name = req.body.name;
    var price = req.body.price;
    var quantity = req.body.quantity;
    var image = req.body.image;

    var product = {id:id, name:name, price:price, image:image, quantity:quantity}

    if(req.session.cart){
        var cart = req.session.cart

        if(!isProductInCart(cart,id)){
            cart.push(product);
            console.log("Connect successfully1");
        }
        
    }
    else{
        req.session.cart = [product];
        var cart = req.session.cart;
        console.log("Connect successfully3");
    }

    //calculateTotal
    calculateTotal(cart,req)
    res.redirect('/cart')

    
});
app.post('/removeProduct', function(req,res){
    var id = req.body.id;
    var cart = req.session.cart;
    console.log(cart);

    for(let i=0;i<cart.length;i++){ 
        cart.splice(cart.indexOf(i),1);
    }
    calculateTotal(cart,req);
    res.redirect('/cart');


});
app.post('/edit_product_quantity', function(req,res){
    var id =req.body.id;
    var quantity=req.body.quantity;
    var increase_btn=req.body.increase_product_quantity;
    var decrease_btn=req.body.decrease_product_quantity;
    console.log(decrease_btn);
    var cart = req.session.cart;

    if (increase_btn){
        for(let i=0;i<cart.length; i++)
        {
            if (cart[i].id==id)
            {
                if(cart[i].quantity>0)
                {
                    cart[i].quantity=parseInt(cart[i].quantity)+1;
                }
            }
        }
    }
    if (decrease_btn){
        for(let i=0;i<cart.length; i++)
        {
            if (cart[i].id==id)
            {
                if(cart[i].quantity>1)
                {
                    cart[i].quantity=parseInt(cart[i].quantity)-1;
                }
            }
        }
    }

    calculateTotal(cart,req);
    res.redirect('/cart');
});

app.get('/cart', function(req,res){
    var name = req.session.user_name;
   
    if(req.session.user_id){
        var cart = req.session.cart
        var total = req.session.total
        //return cart page 
        res.render('pages/cart',{cart:cart, total:total,session:req.session,name:name});
        }
        else
        {
            res.render('pages/login');
        }
    
});
 


app.get('/checkout',function(req,res){
    var name = req.session.user_name;
    var cart = req.session.cart;
    var total = req.session.total;
    var connect = mysql.createConnection({
        host:"us-cdbr-east-06.cleardb.net",
        user:"b060c3fa72ae89",
        password:"0e6af735",
        database:"heroku_9921352427430fd"
    })

    connect.connect(function(error){
        if(error){
            throw error;
        }
        else{
            console.log("Connect successfully")
        }
    })
    connect.query(`SELECT * FROM heroku_9921352427430fd.users where id=${req.session.user_id}`,(err,result)=>{

        res.render('pages/checkout',{result:result,cart:cart,total:total,session:req.session,name:name});

        console.log(result);
    })
    
});
app.post('/place_orders',function(req,res){
    var name = req.body.name;
    var email = req.body.email;
    var mobile_no=req.body.mobile_no;
    var DiaChi=req.body.DiaChi;
    var cost =req.session.total;
    var MyDate = new Date();
    idbill=Math.floor(Math.random() * 93876);
    var cart= req.session.cart;
    console.log( cart);
    
    
    var connect = mysql.createConnection({
        host:"us-cdbr-east-06.cleardb.net",
        user:"b060c3fa72ae89",
        password:"0e6af735",
        database:"heroku_9921352427430fd"
    })

    connect.connect(function(error){
        if(error){
            throw error;
        }
        else{
            console.log("Connect successfully")
        }
    })
    connect.query(`INSERT INTO heroku_9921352427430fd.cart (userId, idbill, ngay, totalprice, tennguoinhan , DiaChi ,SDTNgươiNhan) VALUES ('${req.session.user_id}', '${idbill}', '${MyDate.toMysqlFormat()}', '${cost}', '${name}', '${DiaChi}', '${mobile_no}')`,(err,result)=>{
        for(let i =0; i<cart.length; i++){
            connect.query(`INSERT INTO heroku_9921352427430fd.itemcart (idbill, idproduct ,soluong ) VALUES ('${idbill}','${cart[i].id}','${cart[i].quantity}')`,(err,result)=>{console.log(result)});
            
        }
        res.redirect('/payment');

        
    })
    
    
    
});

app.get('/payment',function(req,res){
    var name = req.session.user_name;
    cost=req.session.total;

    cost=cost/24000;
    console.log(cost);
    res.render('pages/payment',{cost:cost,session:req.session,name:name});
});



app.get('/:idproduct', function(req,res){
    detailProduct(req.params.idproduct,res,req.session)
})

function detailProduct(id,res,session){
    var name = session.user_name;
    var con = mysql.createConnection({
        host:"us-cdbr-east-06.cleardb.net",
        user:"b060c3fa72ae89",
        password:"0e6af735",
        database:"heroku_9921352427430fd"
    })
    con.connect(function(error){
        if(error){
            throw error;
        }
        else{
            console.log("Connect successfully")
        }
    })  
    con.query(`SELECT * FROM heroku_9921352427430fd.product where idproduct = ${id}`,function(err,result){
        console.log(result)
        res.render('pages/detail', {result:result,session:session,name:name});
    })
}


