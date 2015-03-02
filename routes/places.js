var express = require('express');
var router = express.Router();

var helper = require('mongoskin').helper



/* GET places listing. */
router.get('/', function(req, res, next) {

	var db = req.db;
    db.places.find(req.query).toArray(function (err, items) {
        res.json(items);
    });
  
});

/* POST to Add Places Service */
router.post('/', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Set our collection
    db.places.insert( req.body, function (err, result) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            res.send(result[0]);
        }
        
    });
});

/* DELETE places and the child */
router.delete('/:id',function(req,res){
	var db = req.db;

	deleteHelper(req.params.id,db)
	res.send({code:'OK'})
});

/* PUT places */
router.put('/:id',function(req,res){
	var db = req.db;
	data = req.body
	delete data._id
	console.log(data)
	db.places.updateById(req.params.id,{$set:data},function(err,result){
		res.send({code:'OK'})
	})
});

var deleteHelper = function(id,db){
	db.places.find({parent : id}, function(err, result) {
	    result.each(function(err, place) {
	    	if (place != null)
	        	deleteHelper(place._id.toString(),db)
	    });
	    db.places.removeById(id,function(){})
	});
}

module.exports = router;