import mongoose from 'mongoose';
import validator from 'validator';



let homeSchema = new mongoose.Schema({
      // nombres:{type:String},
    categorie:{type:String},
    address:{type:String},
    img:{type:String},
    images:[{type:String}],
    rent:{type:String},
    description:[{type:String}],
    guarantee:{type:String},
    superficie:{type:String},
    person_id:{type : mongoose.Types.ObjectId , ref: "Persons"},
    token:{type: String}
  });


  export default mongoose.model('Homes', homeSchema)