//console.log('Loaded!');
//var element = document.getElementById('main-text');
//element.innerHTML = 'New Value';
//
//// Move the image
//var img = document.getElementById('madi');
//var marginLeft = 0;
//function moveRight() {
//    marginLeft = marginLeft + 5;
//    img.style.marginLeft = marginLeft + 'px';
//}
//img.onclick = function () {
//    var interval = setInterval(moveRight, 50);
//    img.style.marginLeft = '50px';
//};
var button = document.getElementById('counter');

button.onclick=function() {
    // create a request object
    var request = new XMLHttpRequest();
    //capture the response and store in a variable
    request.onreadystatechange = function () {
        if (request.readystate === XMLHttpRequest.DONE) {
            //take some action
            if (request.status === 500) {
                var counter = request.responseText;
                var span = document.getElementById('count');
                span.innerHTML = counter.toString();
            }
        }
        //Not done yet
    };
    //make the request
    request.open('GET', 'http://http://bala-arunachalam.imad.hasura-app.io/counter', true);
    request.send(null);
};