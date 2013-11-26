/**
* Data anomaly detector based on the 3-sigma rule.
*
* @see
* http://en.wikipedia.org/wiki/68%E2%80%9395%E2%80%9399.7_rule
*/
var AnomalyDetector = {
    data_source : null,
    default_options : {
        data_source : {
            name : 'mongo',
            host : '127.0.0.1',
            port : 27017,
            database : 'anomaly',
            collection : 'distributions'
        }
    },

    /**
     * Init data source (if necessary)
     *
     * @param {object} options
     * @param {callable} cb
     * @return {void}
     * @access public
     */
    init : function(options, cb) {
        this.data_source = require('./' + options.data_source.name + 'DataSource');
        this.data_source.init(options.data_source, function(){
            cb();
        });
    },

    /**
     * Close data source (if necessary)
     *
     * @return {void}
     * @access public
     */
    close : function() {
        this.data_source.close();
    },

    /**
     * Training classifier
     * Calculating probability distribution parameters for each random variable
     *
     * @param {array} random_variables
     * @returns {Array}
     * @access public
     */
    train : function (random_variables, cb) {
        var self = this;
            distributions = {}; // probability distribution parameters array

        for (var id in random_variables){
            var X = random_variables[id],
                e = self._expectedValue(X),
                sigma = self._standardDeviation(X, e);

            // add values to distributions array
            distributions[id] = { e : e, sigma : sigma };
        }

        self.data_source.set(distributions, cb);
    },

    /**
     * Classifier
     * true = value seems to be correct
     * false = value is an outlier
     *
     * @param {integer} id - Random variable id
     * @param {float} v - Random variable value
     * @returns {Boolean}
     * @access public
     */
    test : function (id, v, cb) {
        this.data_source.get(id, function(distribution){
            var e = distribution.e;
            var sigma = distribution.sigma;
            return cb(id, v, Math.abs(e - v) <= (3 * sigma), e, sigma);
        });
    },

    /**
     * Calculating expected value of a random variable
     *
     * @param {array} X
     * @param {integer} pow
     * @returns {float}
     * @access protected
     */
    _expectedValue : function (X, pow) {
        var sum = 0,
            n = X.length;
        // default value if not set
        pow = pow || 1;
        // calculate expected value
        for (var i = 0; i < X.length; i++)
            sum += Math.pow(X[i], pow) * (1 / n);

        return sum;
    },

    /**
     * Calculating standard deviation of a random variable
     *
     * @param {array} X
     * @param {float} e
     * @returns {float}
     * @access protected
     */
    _standardDeviation : function (X, e) {
        var e2 = this._expectedValue(X, 2);
        // count e if not set
        e = e || this._expectedValue(X);
        // return squared root of the variation
        return Math.sqrt(e2 - Math.pow(e, 2));
    }
};

exports = module.exports = AnomalyDetector;