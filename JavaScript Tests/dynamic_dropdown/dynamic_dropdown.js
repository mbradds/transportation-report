

function dynamicDropDown(id,optionsArray){

    function addOption(id,text,select){
        select.options[select.options.length] = new Option(text);
    }

    var select = document.getElementById(id);
    select.options.length = 0;

    for (var i = 0; i < optionsArray.length; i++) {
        addOption (id, optionsArray[i],select);
    }

}

var planets = new Array ("Mercury", "Venus", "Earth", "Mars",
"Jupiter", "Saturn", "Uranus", "Neptune", "Pluto");

dynamicDropDown("sel_planet", planets)


var select_product = document.getElementById('sel_planet');
select_product.addEventListener('change', (select_product) => {
    var product = select_product.target.value;
    console.log(product);
});