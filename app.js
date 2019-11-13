const express = require('express'),multer = require('multer'),bodyParser = require('body-parser'),
              path = require('path'),mongoose = require('mongoose'),fs = require('fs')
var gambar = require('./models/gambar'),dir = './uploads';

mongoose.connect('mongodb://localhost/webtoonii', { useMongoClient: true });
var db = mongoose.connection
db.on('error',function(err){
    console.log(err)
})
db.once('open',function(){
    console.log("Sukses bos");
})

var upload = multer({storage: multer.diskStorage({
  destination: function (req, file, callback) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    callback(null, './uploads');
  },
  filename: function (req, file, callback) 
  { callback(null, file.fieldname +'-' + Date.now()+path.extname(file.originalname));}
  //field name iku Teko NAMA INPUTAN index.ejs >>> di tambah datenow >>>> di tambah extensi gambar
}),

fileFilter: function(req, file, callback) {
  var ext = path.extname(file.originalname)  
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
    return callback(res.end('gambar TOK WOIII!!!!!!!', false))
  }
  callback(null, true)
}
});



var app = new express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port',(process.env.PORT) || 3000)
app.use(express.static('uploads'));

app.get('/', function(req, res){
  gambar.find({}, function(err,data){
    if(err){console.log(err)}
    else{res.render('index',{data:data});}
  })
});

app.post('/', upload.any(), function(req,res){
  if(!req.files){
    res.json({success: false});
  } else {        
    gambar.findOne({},function(err,data){      
      var gambare = new gambar({                
        path:req.files[0].filename,        
      });
      gambare.save(function(err, data){
        if(err)
          console.log(err);
        else
          res.redirect('/');
      });
    })
  }
});
app.get('*',(req,res)=>{res.render('error')})
app.listen(app.get('port'),function(){console.log("Mlaku 3000");})