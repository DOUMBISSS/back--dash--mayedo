import mongoose from 'mongoose';
import validator from 'validator';



let personSchema = new mongoose.Schema({
    name: {type :String,required: true,maxlength: 20},
    prenom:{type:String,required: true,maxlength:40},
    birth:{type:String,required: true},
    lieu:{type:String,required: true},
    nationality:{type:String},
    sexe:{type:String,required: true},
    tel:{type:String,required: true},
    profession:{type:String,required: true},
    address:{type:String,required: true},
    piece:{type:String,required: true},
    date_emission:{type:String,required: true},
    date_expiration:{type:String,required: true},
    date_entrance:{type:String,required: true},
    home_id:[{type : mongoose.Types.ObjectId ,ref:"Homes"}],
    email: {type: String,required: true,unique: true,lowercase: true,
        validate: (value) => {
          return validator.isEmail(value)}},
      date: { type: Date, default: Date.now },
      rentals:[{type : mongoose.Types.ObjectId ,ref:"Rent"}],
      token:{type: String}
  });


  export default mongoose.model('Persons', personSchema)