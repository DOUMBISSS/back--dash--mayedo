import express from 'express';
import Database from './db/database.js';
import User from './db/models/user.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import Persons from './db/models/persons.js';
import Rent from './db/models/rent.js';
// import auth from './middlewares/auth.js'
import Homes from './db/models/home.js';

const app = express();
const port = 4000;
app.use(bodyParser.json());
app.use(cors())

const database = new Database();

Database.connect();


let auth =(req,res,next)=>{
  let token =req.cookies.auth;
  User.findByToken(token,(err,user)=>{
      if(err) throw err;
      if(!user) return res.json({
          error :true
      });
      req.token= token;
      req.user=user;
      next();
  })
}

// app.post('/register',function(req,res){
//   User.findOne({'email': email}.then(user => {
//     if(user){
//         res.send({message: "User already registered"})
//     } else {
//         const user = new User ({
//             email,
//             password,
//             password2
//            })
//            user.save(err => {
//             if(err){
//                 res.send(err)
//             } else {
//                 res.send({message:"Successfully Registered"})
//             }
//            })
//     }
//    }))
  
 
// });

// app.post('/login', function(req,res){
//             User.findOne({'email':req.body.email},function(err,user){
//                 if(!user) return res.json({isAuth : false, message : 'Auth failed ,email not found'});
        
//                 user.comparepassword(req.body.password,(err,isMatch)=>{
//                     if(!isMatch) return res.json({ isAuth : false,message : "password doesn't match"});
        
//                 user.generateToken((err,user)=>{
//                     if(err) return res.status(400).send(err);
//                     res.json({
//                         isAuth : true,
//                         token : user.token,
//                         id : user._id,
//                         email : user.email,
//                         name: user.name
//                     });
//                 });    
//             });
//           });
//        // }
//     });


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(401)
      }
      req.user = user;
      next();
    });
  }
  
  app.get('/api/me', authenticateToken, (req, res) => {
    res.send(req.user);
  });

app.get('/profile',auth,function(req,res){
  res.json({
      isAuth: true,
      id: req.user._id,
      email: req.user.email,
      name: req.user.name
      
  })
});


//logout user
app.get('/logout',auth,function(req,res){
  req.user.deleteToken(req.token,(err,user)=>{
      if(err) return res.status(400).send(err);
      res.sendStatus(200);
  });
});



app.get('/users',function(req,res){
    User.find({})
    .then((doc)=>{res.send(doc)})
    .catch(err => {console.log(err);      
        })
    })

    app.post('/users',function(req,res){
        const newUser=new Persons(req.body)
        newUser.save()
        .then((doc)=>{res.send(doc)})
        .catch(err => {console.log(err);      
         })
    })
app.post('/email',function(req,res){

    const user=new User(req.body);
    var transporter = nodemailer.createTransport({
    host:'mac12.winihost.com',
    port: 465,
    auth: {
    user: 'sci@mayedo.ci',
    pass: 'mayedo@7788'
  }
    });
    
    var mailOptions = {
    from: 'sci@mayedo.ci',
    to: req.body.email,
    subject:req.body.number ,
    text:req.body.content,
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
        });

app.post('/persons',function(req,res){
            const newPerson=new Persons(req.body)
            newPerson.save()
            .then((doc)=> console.log(doc))
            res.status(200).json({
                succes:true,
                message : "Person added with success",
                dataForm : doc
            });
        })
          // Persons.updateOne({"_id" : doc.person_id},{$push : {home_id : doc._id}}) 

app.get('/persons', (req,res) => { 
  // let mysort = { name: 1 }; 
                                // Persons.find({}).populate("rentals").populate("home_id").limit(1)
                                Persons.find({}).populate("rentals").populate("home_id")
                                .then((doc)=>{res.send(doc)})
                                .catch(err => {console.log(err);      
                                    })
                            })

// app.get('/persons', (req,res) => { 
   // let mysort = { name: 1 }; 
//                           Persons.find({}).sort(mysort).limit(1)
//                         .then((doc)=>{res.send(doc)})
//                         .catch(err => {console.log(err);      
//                             })
// })
        
app.get('/persons/:id',(req,res) => {
                                Persons.findById((req.params.id),(req.body)).populate("rentals").populate("home_id")
                                .then((doc)=>{res.send(doc)})
                                .catch(err => {console.log(err);      
                                    })
                            })
        
app.put('/person/:id',(req,res) => { 
                                Persons.findByIdAndUpdate((req.params.id),(req.body))
                                .then((doc)=>{res.send(doc)})
                                .catch(err => {console.log(err);      
                                    })
                            })

app.delete('/person/:id',(req,res) => { 
                              Persons.findByIdAndDelete((req.params.id),(req.body))
                              // Rent.remove({"_id" : doc.person_id},{$push : {rentals : doc._id}})
                              .then((doc)=>{res.send(doc)})
                              .catch(err => {console.log(err);      
                                  })
                          })

app.get('/rents', (req,res) => {
                              Rent.find({}).populate("person_id")
                              .then((doc)=>{res.send(doc)})
                              .catch(err => {console.log(err);      
                                  })
                          })
app.post('/rents',function(req,res){
                                const newRent= new Rent(req.body)
                                newRent.save((err,doc)=>{
                                  if(err) {console.log(err);
                                      return res.status(400).json({ success : false});}
                                      Persons.updateOne({"_id" : doc.person_id},{$push : {rentals : doc._id}})
                                      .then((doc)=> console.log(doc))
                                    res.status(200).json({
                                      succes:true,
                                      message : "Rent added with success",
                                      dataPayment : doc
                                  });
                              })
                            })
        
                            
app.get('/rents/:id',(req,res) => { 
                              Rent.findById((req.params.id),(req.body))
                              .then((doc)=>{res.send(doc)})
                              .catch(err => {console.log(err);      
                                  })
                          })

app.get('/homes', (req,res) => { 
                            Homes.find({}).populate("person_id")
                            .then((doc)=>{res.send(doc)})
                            .catch(err => {console.log(err);      
                                })
                        })

app.post('/homes',function(req,res){
                          const homes= new Homes(req.body)
                          homes.save((err,doc)=>{
                            if(err) {console.log(err);
                                return res.status(400).json({ success : false});}
                                Persons.updateOne({"_id" : doc.person_id},{$push : {home_id : doc._id}})
                                .then((doc)=> console.log(doc))
                              res.status(200).json({
                                succes:true,
                                message : "homes added with success",
                                dataHomes : doc
                            });
                        })
                      })

app.get('/homes/:id',(req,res) => { 
                        Homes.findById((req.params.id),(req.body)).populate("person_id")
                        .then((doc)=>{res.send(doc)})
                        .catch(err => {console.log(err);      
                            })
                    })

// app.get('/homes/:id',(req,res) => { 
//                       Homes.aggregate([
//                         { $match: { status: "Payé" } },
//                         { $group: { "_id": doc.person_id, total: { $sum: Rent } } },
//                         { $sort: { total: -1 } }
//                       ])
//                   })



// Homes.create([
//                       {
//                           categorie:'Appartement',
//                           address: 'Riviera Golf 4',
//                           description:[
//                               'Superbe penthouse de 3 pièces à Riviera mondial béton avec vue sur la lagune ',
//                               'chambre principale autonome','salle d’eau extérieure à la seconde chambre',
//                               'toilette visiteur','séjour staffé','cuisine européenne','immense terrasse et immense cour'
//                           ],
//                           rent :'5500000',
//                           nombres:"2 pièces",
//                           img :"villa 01.jpg",
//                           images :[
//                               "villa 01.jpg",
//                               "villa 02.jpg",
//                               "villa 05.jpeg",
//                               "villa 07.jpeg",
//                           ],
//                       },
                  
//                       {
//                           categorie:'Villa',
//                           address: 'Riviera Golf 4 Beverly Hils',
//                           description:[
//                               'Superbe penthouse de 3 pièces à Riviera mondial béton avec vue sur la lagune ',
//                               'chambre principale autonome','salle d’eau extérieure à la seconde chambre',
//                               'toilette visiteur','séjour staffé','cuisine européenne','immense terrasse et immense cour'
//                           ],
//                           rent :'5500000',
//                           img :"villa 21.jpeg",
//                           nombres:"2 pièces",
//                           images :[
//                               "villa 21.jpeg",
//                               "villa 21.jpeg",
//                               "villa 22.jpeg",
//                               "villa 03.jpg",
//                           ],
//                       },
                  
//                       {
//                           categorie:'Villa',
//                           address: 'II Plateaux',
//                           description:[
//                               'Superbe penthouse de 3 pièces à Riviera mondial béton avec vue sur la lagune ',
//                               'chambre principale autonome','salle d’eau extérieure à la seconde chambre',
//                               'toilette visiteur','séjour staffé','cuisine européenne','immense terrasse et immense cour'
//                           ],
//                           rent :'5500000',
//                           img :"villa 50.jpg",
//                           nombres:"2 pièces",
//                           images :[
//                               "villa 50.jpg",
//                               "villa 51.jpg",
//                               "villa 52.jpg",
//                               "villa 53.jpg",
//                           ],
//                       },
                  
//                       {
//                           categorie:'Appartement',
//                           address: 'II Plateaux',
//                           description:[
//                               'Superbe penthouse de 3 pièces à Riviera mondial béton avec vue sur la lagune ',
//                               'chambre principale autonome','salle d’eau extérieure à la seconde chambre',
//                               'toilette visiteur','séjour staffé','cuisine européenne','immense terrasse et immense cour'
//                           ],
//                           rent :'5500000',
//                           nombres:"2 pièces",
//                           img :"villa 01.jpg",
//                           images :[
//                               "villa 01.jpg",
//                               "villa 02.jpg",
//                               "villa 05.jpeg",
//                               "villa 07.jpeg",
//                           ],
//                       },
                  
//                       {
//                           categorie:'Appartement',
//                           address: 'Cocody Angre Arcade 3 ',
//                           description:[
//                               'Superbe penthouse de 3 pièces à Riviera mondial béton avec vue sur la lagune ',
//                               'chambre principale autonome','salle d’eau extérieure à la seconde chambre',
//                               'toilette visiteur','séjour staffé','cuisine européenne','immense terrasse et immense cour'
//                           ],
//                           rent :'5500000',
//                           nombres:"2 pièces",
//                           img :"villa 42.jpg",
//                           images :[
//                               "villa 42.jpg",
//                               "villa 40.jpg",
//                               "villa 41.jpg",
//                               "villa 43.jpg",
//                           ],
//                       },
                  
//                       {
//                           categorie:'Appartement',
//                           address: 'Riviera III',
//                           description:['chambre principale autonome','salle d’eau extérieure à la seconde chambre',
//                               'toilette visiteur','séjour staffé','cuisine européenne','immense terrasse et immense cour'
//                           ],
//                           rent :'5500000',
//                           nombres:"2 pièces",
//                           img :"villa 60.jpg",
//                           images :[
//                               "villa 60.jpg",
//                               "villa 61.jpg",
//                               "villa 62.jpg",
//                               "villa 63.jpg",
//                           ],
//                       },
                  
//                   ])

// Homes.create([
                  
//                       {
//                           categorie:'Villa 6 pièces',
//                           address: 'Riviera Golf 4 Beverly Hils',
//                           description:[
//                               'Superbe penthouse de 3 pièces à Riviera mondial béton avec vue sur la lagune ',
//                               'chambre principale autonome','salle d’eau extérieure à la seconde chambre',
//                               'toilette visiteur','séjour staffé','cuisine européenne','immense terrasse et immense cour'
//                           ],
//                           rent :'750 000',
//                           img :"villa 21.jpeg",
//                               superficie:"300m²",
//                               guarantee:"1 500 000",
//                           images :[
//                               "villa 21.jpeg",
//                               "villa 21.jpeg",
//                               "villa 22.jpeg",
//                               "villa 03.jpg",
//                           ],
//                       },
                  
                  
//                       {
//                           categorie:'Appartement',
//                           address: 'Cocody Angre Arcade 3 ',
//                           description:[
//                               'Superbe penthouse de 3 pièces à Riviera mondial béton avec vue sur la lagune ',
//                               'chambre principale autonome','salle d’eau extérieure à la seconde chambre',
//                               'toilette visiteur','séjour staffé','cuisine européenne','immense terrasse et immense cour'
//                           ],
//                           rent :'550 000',
//                           img :"villa 42.jpg",
//                               superficie:"300m²",
//                               guarantee:"1 100 000",
//                           images :[
//                               "villa 42.jpg",
//                               "villa 40.jpg",
//                               "villa 41.jpg",
//                               "villa 43.jpg",
//                           ],
//                       },
                  
//                   ])

app.listen(port , ()=> {
    console.log('Server running at http:127.0.0.1:' + port)
})