let controller = {
    unprotected: (req,res)=>{
        res.json({mensaje:"Ok. ruta sin proteger"});
    },
    protected: (req,res)=>{
        console.log("caso protected");
        res.json({mensaje: "ok"});        
    },
    protected2: (req,res)=>{
        console.log("caso protected2");
        //res.send(`Ok ${req.user.first_name} ${req.user.last_name}, bienvenido a la ruta protegida.`);
        res.json(req.user);
    },
}

module.exports = controller;