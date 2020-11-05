var myNestedVals = {
    'All': {
        'Oil1': '',
        'Oil2': '',
        'Gas1': '',
        'Gas2': ''
    },
    'Oil': {
        'Oil1': '',
        'Oil2': ''
    },
    'Gas': {
        'Gas1': '',
        'Gas2': ''
    }
}


const dynamicDropDown = (select, optionsArray) => {

    function addOption(text, select) {
        select.options[select.options.length] = new Option(text);
    }
    var i, L = select.options.length - 1;
    for(i = L; i >= 0; i--) {
       select.remove(i);
    }
    select.options.length = 0;
    optionsArray.map((v, i) => {
        addOption(optionsArray[i], select);
    })

    $(select).selectpicker('refresh');

}

const initialDropDows = (id,valueDdl1,valueDdl2) => {
    var select = document.getElementById(id);
    var ddl2keys = Object.keys(myNestedVals[valueDdl1]);
    dynamicDropDown(select=select,optionsArray=ddl2keys)
    select.value = valueDdl2
    $(select).selectpicker('refresh');
}


const configureDDL2 = (ddl1, ddl2) => {
    ddl2.options.length = 0;
    var ddl2keys = Object.keys(myNestedVals[ddl1.value]);
    dynamicDropDown(select=ddl2,optionsArray=ddl2keys)
    $(ddl2).selectpicker('refresh');
}


initialDropDows(id='ddl2',value1='All',value2='Gas1')