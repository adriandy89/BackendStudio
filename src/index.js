require('dotenv').config();
const express           = require('express');
const path 				= require('path');
const bodyParser        = require('body-parser');
const mongoose          = require('mongoose');
const passport          = require("passport");
const JwtStrategy       = require('passport-jwt').Strategy;
const LocalStrategy     = require('passport-local').Strategy;
const ExtractJwt        = require('passport-jwt').ExtractJwt;
const bcrypt            = require('bcrypt');
const cors              = require('cors');
const routes            = require('./routes/rutas');
const User              = require('./models/user');
const customMdw         = require('./middleware/custom');

mongoose.set("useFindAndModify", false);
mongoose.connect(process.env.MONGO_URI, { 
    useCreateIndex: true, 
    useNewUrlParser: true,  
    useUnifiedTopology: true 
})
.then(data => console.log('DB connected'))
.catch((err)=>{console.log(err); process.exit(1)});

let app = express();

/** config de estrategia local de passport ******/
passport.use(new LocalStrategy({
    usernameField: "usuario",
    passwordField: "password",
    session: false
}, (usuario, password, done)=>{
    console.log("ejecutando *callback verify* de estategia local");
    User.findOne({usuario:usuario}).lean()
    .then(data=>{
        if(data === null) return done(null, false); //el usuario no existe
        else if(!bcrypt.compareSync(password, data.password)) { return done(null, false); } //no coincide la password
      // else if(password!=data.password) { return done(null, false); }
       return done(null, data); //login ok
    })
    .catch(err=>done(err, null)) // error en DB
}));

/** config de estrategia jwt de passport ******/
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;
opts.algorithms = [process.env.JWT_ALGORITHM];

passport.use(new JwtStrategy(opts, (jwt_payload, done)=>{
    console.log("ejecutando *callback verify* de estategia jwt");
    User.findOne({_id: jwt_payload.sub}).lean()
        .then(data=>{
        if (data === null) { //no existe el usuario
            //podríamos registrar el usuario
            return done(null, false);
        }
        /*encontramos el usuario así que procedemos a devolverlo para
        inyectarlo en req.user de la petición en curso*/
        else  
            return done(null, data);
        })
        .catch(err=>done(err, null)) //si hay un error lo devolvemos
}));

//conectamos todos los middleware de terceros
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());

//conectamos todos los routers
app.use('/api', routes);

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
return 	res.redirect("/")
});

//el último nuestro middleware para manejar errores
app.use(customMdw.errorHandler);
app.use(customMdw.notFoundHandler);

let port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('express server listening ...');
});

