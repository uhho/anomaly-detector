/**
* Data anomaly detector based on the 3-sigma rule.
* @see http://en.wikipedia.org/wiki/68%E2%80%9395%E2%80%9399.7_rule
*
* @package AnomalyDetector
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
        },
        // decimal accuracy for expected value and standard deviation
        // random variable should not be smaller than this value
        accuracy : 0.1
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
        this.accuracy = options.accuracy || this.default_options.accuracy;
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
                E = self._expectedValue(X),
                sigma = self._standardDeviation(X, E);

            // add values to distributions array
            distributions[id] = { e : E, sigma : sigma };
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
     * @returns {callable}
     * @access public
     */
    test : function (id, v, cb) {
        this.data_source.get(id, function(distribution){
            var E = distribution.e,
                sigma = distribution.sigma;

            return cb(id, v, Math.abs(E - v) <= (3 * sigma), E, sigma);
        });
    },

    /**
     * Calculating expected value (E) of a random variable
     *
     * @param {array} X - random variable
     * @param {integer} pow - power used in summation operator (optional, default = 1)
     * @returns {float}
     * @access protected
     */
    _expectedValue : function (X, pow) {
        var sum = 0,
            n = X.length;
        // set default value if not set
        pow = pow || 1;

        // if random variable is empty, return 0
        if (n == 0) return 0;

        for (var i = 0; i < n; i++)
            sum += Math.pow(X[i], pow) / this.accuracy;

        return sum / (n / this.accuracy);
    },

    /**
     * Calculating standard deviation (sigma) of a random variable
     *
     * @param {array} X
     * @param {float} Ex - expexted value of X (optional)
     * @returns {float}
     * @access protected
     */
    _standardDeviation : function (X, Ex) {
        var Ex2 = this._expectedValue(X, 2);
        // calculate expected value if not set
        Ex = Ex || this._expectedValue(X);

        // return squared root of the variation
        return Math.sqrt(Ex2 - Math.pow(Ex, 2));
    }
};

exports = module.exports = AnomalyDetector;