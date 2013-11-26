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
        var remove_ids = [];
        var self = this;

        for (var id in distributions) {
            distributions[id]._id = id;
            data.push(distributions[id]);
            remove_ids.push(id);
        }

        // remove all data
        this.collection.remove({ _id : { $in : remove_ids } }, function(err, result){
            if(err) throw err;

            // insert multiple distribution parameters
            self.collection.insert(data, function(err, result){
                if(err) throw err;
                cb(result);
            });
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