/**
 * Memory data source
 */
var MemoryDataSource = {
    distributions : {},

    /**
     * Initialize data source
     * 
     * @param {object} options
     * @param {callable} cb
     * @returns {void}
     * @access public
     */
    init: function(options, cb) {
        cb();
    },
    
    /**
     * Clear distribution data
     * 
     * @param {callable} cb
     * @returns {void}
     * @access public
     */
    clear : function(cb) {
        this.distributions = {};
        cb();
    },
    
    /**
     * Close data source
     * 
     * @returns {void}
     * @access public
     */
    close : function() {},
    
    /**
     * Save multiple distribution parameters
     * 
     * @param {object} distributions
     * @param {callable} cb
     * @returns {void}
     * @access public
     */
    set : function(distributions, cb) {
        this.distributions = distributions;
        cb();
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
        cb(this.distributions[id]);
    }
};

exports = module.exports = MemoryDataSource;