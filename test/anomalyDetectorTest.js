var assert = require('assert');
var detector = require('../lib/index');

detector.init({
    data_source : { name : 'memory'}
}, function(){});

describe('AnomalyDetector', function() {

    describe('#train()', function() {
        it('should correctly train classifier for small and big values', function(done) {
            detector.train({
                'a' : [4, 4, -4, -4],               // positive / negative
                'b' : [0, 6, 8, 14],                // standard
                'c' : [0, 600000, 800000, 1400000], // big
                'd' : [0, 0.6, 0.8, 1.4],           // small
                'e' : [5, 5, 5]                     // eqal
            }, function(){
                assert.deepEqual(detector.data_source.distributions, {
                    'a' : {e : 0, sigma : 4},
                    'b' : {e : 7, sigma : 5},
                    'c' : {e : 700000, sigma : 500000},
                    'd' : {e : 0.7, sigma : 0.5},
                    'e' : {e : 5, sigma : 0}
                });
                done();
            });
        });
    });

    describe('#test()', function() {
        it('should return correct result for positive case', function(done) {
            // prepare data source to return sample data
            detector.data_source.distributions = {'a' : {e : 7, sigma : 5}};

            detector.test('a', 22, function(i, v, result){
                assert.equal(result, true);
                done();
            });
        });

        it('should return correct result for negative case', function(done) {
            // prepare data source to return sample data
            detector.data_source.distributions = {'a' : {e : 7, sigma : 5}};

            detector.test('a', 23, function(i, v, result){
                assert.equal(result, false);
                done();
            });
        });
    });

    describe('#_expectedValue()', function() {
        it('should return expected value of a random variable (without arugment)', function() {
            var result = detector._expectedValue([0, 6, 8, 14]);
            assert.equal(result, 7);
        });

        it('should return squared expected value of a random variable (with arugment)', function() {
            var result = detector._expectedValue([0, 6, 8, 14], 2);
            assert.equal(result, 74);
        });

        it('should return error for a very small values', function() {
            var result = detector._expectedValue([0, 0.006, 0.008, 0.014], 1, 100);
            assert.notEqual(result, 0.007);
        });

        it('should return correct value for a very small values with accuracy setting', function() {

            detector.init({
                data_source : { name : 'memory'},
                accuracy : 0.001
            }, function(){});

            var result = detector._expectedValue([0, 0.006, 0.008, 0.014], 1, 1000);
            assert.equal(result, 0.007);
        });
    });

    describe('#_standardDeviation()', function() {
        it('should return standard deviation (without argument)', function() {
            var result = detector._standardDeviation([0, 6, 8, 14]);
            assert.equal(result, 5);
        });

        it('should return standard deviation (with argument)', function() {
            var result = detector._standardDeviation([0, 6, 8, 14], 7);
            assert.equal(result, 5);
        });
    });
});