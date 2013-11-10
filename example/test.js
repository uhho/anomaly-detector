var detector = require('../lib/index.js');

var random_variable_id = 'b';
var testing_values = [50, 70, 90, 110, 130, 150, 170];

detector.init(detector.default_options, function(){
    
    var counter = 0;
    for (var i = 0; i < testing_values.length; i++) {
        var value = testing_values[i];
        
        // test whether values is ok or an outlier
        detector.test(random_variable_id, value, function(id, v, result) {
            console.log(v, result);
            
            // if all tests are done, close dataSource connection
            if (counter++ === (testing_values.length - 1)) {
                detector.close();
            } 
        });
    }
});
