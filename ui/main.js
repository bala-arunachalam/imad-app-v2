//Counter code
var button = document.getElementById('counter');

button.onclick = function () {
    
    // create a request object
    var request = new XMLHttpRequest();
    
    //capture the response and store in a variable
    request.onreadystatechange = function () {
        if (request.readystate === XMLHttpRequest.DONE) {
            //take some action
            if (request.status === 200) {
                var counter = request.responseText;
                var span = document.getElementById('count');
                span.innerHTML = counter.toString();
            }
        }
        //Not done yet
    };
    
    //make the request
    request.open('GET', 'http://bala-arunachalam.imad.hasura-app.io/counter', true);
    request.send(null);
};

//Submit name

var submit = document.getElementById('submit_btn');
submit.onclick = function () {
    //Create a req object
     var request = new XMLHttpRequest();
    
    //Capture the response and store it in a var
       request.onreadyStatechange = function () {
        if (request.readystate === XMLHttpRequest.DONE) {
            //take some action
            if (request.status === 200) {
    var names = request.responseText;
    names = JSON.parse(names);
    var list = '';
    for (var i=0; i< name.length; i++) {
        list += '<li>' + name[i] + '</li>';
    }
          
    var ul = document.getElementById('nameList');
    ul.innerHTML = list;
            }
        }
    
    var nameInput = document.getElementById('name');
var name = nameInput.value;
            //make the request
    request.open('GET', 'http://bala-arunachalam.imad.hasura-app.io/submit-name=?name' + name , true);
    request.send(null);
};

};










