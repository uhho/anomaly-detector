# Anomaly Detector #
Data anomaly detector for NodeJS

## Instalation ##

Copy directory to your project folder under node_modules

## Examples ##

### Training classifier
```js
var detector = require('anomaly-detector');

var random_variables = {
    'a' : [ 18, 15, 16, 17, 14, 15, 16 ],
    'b' : [ 110, 130, 125, 124, 128, 118, 119 ],
    'c' : [ 110, 115, 113, 114, 90, 116, 90 ]
};

// by default, detector is storing training data in mongo database
detector.init(detector.default_options, function(){
    detector.train(random_variables, function(distributions){
        console.log('training finished!');
        console.log(distributions);
        detector.close();
    });
});
```

### Testing classifier
```js
var detector = require('anomaly-detector');

var random_variable_id = 1;
var testing_values = [50, 70, 90, 110, 130, 150, 170];

// by default, detector is storing training data in mongo database
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
```

### Using memory data source

```js
var detector = require('anomaly-detector');

var options = { 
    data_source : {
        name : 'memory'
    }
};

detector.init(detector.default_options, function(){
    ...
});

```

## Next releases ##

* File data source
* Error handling
* Different detection methods

## License ##

Software is licensed under MIT license.
For more information check LICENSE file.