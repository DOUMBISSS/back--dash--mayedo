import mongoose from "mongoose";

// const server = '127.0.0.1:27017'; 
const server = 'mongodb+srv://doumbia77fode:Djenebou77@clustermayedo.jcisxbu.mongodb.net/?retryWrites=true&w=majority'
// const server = 'mongodb+srv://doumbia77fode:Djenebou77@clustermayedo.jcisxbu.mongodb.net/'
const database = 'dash mayedo';     
class Database {
    static connect() {
     mongoose.connect(server)
       .then(() => {
         console.log('Database connection successful')
       })
       .catch(err => {
         console.error(err.message)
       })
  }
  
}
export default Database;