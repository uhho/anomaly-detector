var MongoClient = require('mongodb').MongoClient;

/**
 * Mongo data source
 */
var MongoDataSource = {
    collection : null,
    db : null,
    
    /**
     * Initialize data source
     * 
     * @param {object} options
     * @param {callable} cb
     * @returns {void}
     * @access public
     */
    init: function(options, cb) {
        var self = this;
        
        if (!self.collection) {
            MongoClient.connect('mongodb://' + options.host + ':' + options.port + '/' + options.database, function(err, db) {
                if(err) throw err;
                self.db = db;
                self.collection = self.db.collection(options.collection);
                cb();
            });
        } else {
            cb();
        }
    },
    
    /**
     * Clear distribution data
     * 
     * @param {callable} cb
     * @returns {void}
     * @access public
     */
    clear : function(cb) {
        // remove all data from collection
        this.collection.remove(function(err, items){
            if(err) throw err;
            cb();
        });
    },
    
    /**
     * Close data source
     * 
     * @returns {void}
     * @access public
     */
    close : function() {
        this.db.close();
    },
    
    /**
     * Save multiple distribution parameters
     * 
     * @param {object} distributions
     * @param {callable} cb
     * @returns {void}
     * @access public
     */
    set : function(distributions, cb) {
        var data = [];

        for (var id in distributions) {
            distributions[id]._id = id;
            data.push(distributions[id]);
        }
        
        // insert multiple distribution parameters
        this.collection.insert(data, function(err, result){
            if(err) throw err;
            cb(result);
        });
    },
    
    /**
     * Get distribution parameters by variable id
     * 
     * @param {string|integer} id
     * @param {callable} cb
     * @returns {void}
     * @access public
     */
    get : function(id, cb) {
        // find distribution parameters of a random variable
        this.collection.findOne({_id : id}, function(err, data){
            if(err) throw err;
            cb(data);
        });
    }
};

exports = module.exports = MongoDataSource;