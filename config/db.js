const mongoose=require('mongoose');

function connectoDB(){
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log("Connected to DataBase");
    });
}

module.exports=connectoDB;