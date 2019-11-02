/**
 * Redis data source
 *
 * @package AnomalyDetector.DataSource
 */
var RedisDataSource = {
    redisClient: null,
    redisBase: 'anomalyDetector',

    /**
     * Initialize data source
     *
     * @param {object} options
     * @param {callable} cb
     * @returns {void}
     * @access public
     */
    init: function(options, cb) {
        if (options.host) {
            this.redisClient = redis.createClient(options);

            this.redisClient.on('error', function(err) {
                console.error(err);
            })
        } else if (options.get && options.set) {
            this.redisClient = options;
        } else {
            this.redisClient = require('redis').createClient()

            this.redisClient.on('error', function(err) {
                console.error(err);
            })
        }

        cb()
    },

    /**
     * Close data source
     *
     * @returns {void}
     * @access public
     */
    close : function() {
        this.redisClient.quit();
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
        // overwrite distribution data
        var promises = []
        var _that = this
        for (var i in distributions) {
            promises.push((function() {
                return new Promise((resolve, reject) => {
                    _that.redisClient.set(_that.redisBase+':'+i, JSON.stringify(distributions[i]), function(error, result) {
                        error ? reject(error) : resolve(result);
                    })
                })
            })())
        }
        Promise.all(promises).then(function() {
            cb();
        })
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
        this.redisClient.get(this.redisBase+':'+id, function(error, result) {
            if (error)
                console.error(error);
            else
                cb(result ? JSON.parse(result) : null);
        })
    }
};

exports = module.exports = RedisDataSource;