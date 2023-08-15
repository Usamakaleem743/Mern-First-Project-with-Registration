require('dotenv').config();
const mongoose=require('mongoose');
mongoose.connect(process.env.CONNECTION)
.then(()=>{
    console.log('Connection Successfully .')
})
.catch((e)=>{
    console.log(e)
});