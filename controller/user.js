const User = require("../models/user"); //variable to define the collection or the model in the databse
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// signup dunction
exports.signup = (req, res) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      ///hash represents the password
      const user = new User({
        email: req.body.email,
        password: hash,
        phone: req.body.phone,
        date: Date(),
      });
      user
        .save()
        .then(() => res.status(201).json({ message: `Utilisateur crée` }))
        .catch((error) => {
          res.status(400).json({ error });
        });
    })
    .catch((error) => res.status(500).json({ error }));
};

// login function
exports.login = (req, res) => {
  User.findOne({ email: req.body.email })
    // user represents the variable for to retrieve the email  seizure by the user
    .then((user) => {
      if (!user) {
        return res
          .status(400)
          .json({ message: "Paire login/mot de passe incorrect" });
      }
      // if the information entered by user are valid
      bcrypt.compare(req.body.password, user.password).then((valid) => {
        //if the information is not valid
        if (!valid) {
          return res
            .status(401)
            .json({ message: "Paire login/mot de passe incorrect" });
        }
        //if the information is valid
        res.status(200).json({
          userId: user._id,
          token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
            expiresIn: "24h",
          }),
        });
      });
    })
    .catch((error) => res.status(500).json({ error }));
};
