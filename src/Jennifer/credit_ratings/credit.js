//var select = document.getElementById('multi');
// $("#multi").selectpicker({
//     onChange: function() {
//         console.log($("multi").val());
//     }
// }); 

$("#multi").on('change',function() {
    console.log($(this).val());
  });