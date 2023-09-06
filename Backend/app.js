const express = require('express')

const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
const cors = require('cors')

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const { uploadFile, getFileStream } = require('./s3')

const app = express()
const mongoStore =  require('connect-mongo');
const { default: mongoose } = require('mongoose')

const Cars = require('./models/car.model')

mongoose.connect(process.env.MONGO_URL);


app.use(cors())


console.log("store");


app.get('/images/:key', (req, res) => {
  // console.log(req.params)
  const key = req.params.key
  const readStream = getFileStream(key)

  readStream.pipe(res)
})

app.post('/images', upload.single('image'), async (req, res) => {
  try{
    const file = req.file
    console.log("RERTERDSREHDSHDRSHNTBDFHRHDFTCHBDRHR")
    console.log(req.body);
    // apply filter
    // resize 
  
    const imageUrl = await uploadFile(file);

    
    await updateS3UrlInMongo(req.body?.VIN, imageUrl);

    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&", req.body?.VIN, imageUrl)

    // console.log(result);
    await unlinkFile(file.path);
    
    const description = req.body.description
    res.send({imagePath: `/images/${imageUrl.Key}`})
  }catch(e){
    console.log("HEllo lolu, ", e);
  }

})
// Mongo 
async function updateS3UrlInMongo(vin,imageUrl ){ 
  try{
    const query = { VIN: vin }; 
    const result = await Cars.updateOne(query, { $push: { pictures: imageUrl?.key } });

    if(result?.modifiedCount !==1){
   
      const cars = new Cars({
        VIN: vin,
        pictures: [imageUrl?.Key],
      });
      await cars.save();
    }

  }catch(e){
    console.log('error aya ************', e)
  }
}
app.listen(8080, () => console.log("listening on port 8080"))


// find one 

// const foundObject = await Cars.findOne({ VIN:vin  }).exec();
// console.log('Found object: xdfghjsdklfj gghdklfgh dkjfgh kdjsfglj');
//  console.log('Found object:', foundObject);