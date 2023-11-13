import mongoose from 'mongoose';
import validator from 'validator';



let rentSchema = new mongoose.Schema({
    date_of_payment:{type:String},
    month:{type:String},
    time:{type:String},
    status:{type:String},
    mode:{type:String},
    person_id:{type : mongoose.Types.ObjectId , ref: "Persons"},
      date: { type: Date, default: Date.now },
  });


  export default mongoose.model('Rent', rentSchema)