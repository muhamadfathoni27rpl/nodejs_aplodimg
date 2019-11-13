var mongoose = require('mongoose');
var Schema = mongoose.Schema;

gambar = new Schema( {		
	path:String,
}),
gambare = mongoose.model('Gambar', gambar);

module.exports = gambare;