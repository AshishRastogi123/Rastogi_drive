const mongoose=require('mongoose');

function connectoDB(){
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log("Connected to DataBase");
    }).catch((err) => {
        console.error("Database connection error:", err);
        process.exit(1);
    });
}

module.exports=connectoDB;