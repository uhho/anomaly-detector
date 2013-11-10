var detector = require('../lib/index.js');

var options = detector.default_options;

// initialize detector
detector.init(options, function(){
    
    // training classifier for 3 separate random variables
    var random_variables = {
        'a' : [ 18, 15, 16, 17, 14, 15, 16 ],
        'b' : [ 110, 130, 125, 124, 128, 118, 119 ],
        'c' : [ 110, 115, 113, 114, 90, 116, 90 ]
    };
    detector.train(random_variables, function(){
        
        // testing
        var variable_id = 'b';
        var testing_values = [50, 70, 90, 110, 130, 150, 170];

        var counter = 0;
        for (var i = 0; i < testing_values.length; i++) {
            var value = testing_values[i];

            // test whether values is ok or an outlier
            detector.test(variable_id, value, function(id, v, result) {
                console.log(v, result);
                
                // if all tests are done, close dataSource connection
                if (counter++ === (testing_values.length - 1)) {
                    detector.close();
                } 
            });
        }
    });
});