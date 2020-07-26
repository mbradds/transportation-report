
var csv = [
    ['Date','date1','date2','date3','date4'],
    ['Value',1,2,3,4],
    ['Units','bbl','bbl','m3','m3']
];

var filter_column = 'Units';

for (i=0;i<csv.length;i++){
    var filter_index = 0;
    if (filter_column === csv[i][0]){
        filter_index = i
    }
};

for (c=0;c<csv.length;c++){

    for (r=0;r<csv[c].length;r++){
        if (csv[filter_index][r] === 'm3'){
            //console.log(csv[c][r]);
            delete csv[c][r];
        }
    }

};

for (c=0;c<csv.length;c++){
    csv[c] = csv[c].filter(function (el) {
        return el != null;
      });
};

console.log(csv);





