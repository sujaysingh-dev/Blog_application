import mongoose, { connect } from 'mongoose';

const dbConnection = async() => {
    try{
        const db = await mongoose.connect(process.env.MONGO);
        console.log(`db connected ${db.connection.name}`);
    }catch(error){
        return res.status(500).json({message: "db connection error"});
        process.exit(1);
    }
}

export default dbConnection;