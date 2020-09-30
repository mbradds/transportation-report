const getData = (Url) => {
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET", Url, false);
    Httpreq.send(null);
    return Httpreq.responseText;
};

const dynamicDropDown = (id,optionsArray) => {

    function addOption(id,text,select){
        select.options[select.options.length] = new Option(text);
    }

    var select = document.getElementById(id);
    //select.options.length = 0;

    for (var i = 0; i < optionsArray.length; i++) {
        addOption (id, optionsArray[i],select);
    }

}

//gets the unique regions to populate the dropdown
const getUnique = (items, filterColumns) => {
    if (Array.isArray(filterColumns)) {
        var lookup = [];
        var result = {};

        for (f in filterColumns) {
            lookup.push({})
            result[filterColumns[f]] = []
        }

        for (var item, i = 0; item = items[i++];) {
            for (f in filterColumns) {
                var name = item[filterColumns[f]];
                if (!(name in lookup[f])) {
                    lookup[f][name] = 1;
                    result[filterColumns[f]].push(name);
                }
            }
        }
        return result

    } else {
        var lookup = {};
        var result = [];
        for (var item, i = 0; item = items[i++];) {
            var name = item[filterColumns];
            if (!(name in lookup)) {
                lookup[name] = 1;
                result.push(name);
            }
        }
        return result
    }
}


const fillDrop = (column,dropName,value,data) => {
    const drop = getUnique(data, filterColumns = column)
    dynamicDropDown(dropName, drop.sort())
    document.getElementById(dropName).value = value;
}