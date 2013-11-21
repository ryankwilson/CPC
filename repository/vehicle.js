exports.getAll = function() {
    var collection = db.get('vehiclecollection');
    return collection.find({}, {}, function(data){return data;});
};