const mongoose = require('mongoose')

const dbURL = 'mongodb://localhost:27017/productDB'
mongoose.connect(dbURL,{
    useNewUrlParser:true,
    UseUnifiedTopology:true
}).catch(err=>console.log(err))

let productSchema = mongoose.Schema({
    name:String,
    price:Number,
    src:String,
    des:String
})

//สร้างmodelที่มีโครงสร้างschemaตามproductSchema
let Product = mongoose.model('products',productSchema)

module.exports = Product

module.exports.saveProduct = function(model,data){
    model.save(data)
}
