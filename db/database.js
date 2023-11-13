import mongoose from "mongoose";

// const server = '127.0.0.1:27017'; 
// const server = 'mongodb+srv://doumbisss:Djenebou77@cluster0.txac1je.mongodb.net/mayedo?retryWrites=true&w=majority'
const server = 'mongodb+srv://doumbia77fode:Djenebou77@clustermayedo.jcisxbu.mongodb.net/'
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