console.log('Loaded!');
var element = document.getElementById('main-text');
element.innerHTML = 'New Value';
// Move the image
var img = document.getElementByID('madi');
img.onclick = function () {
    img.style.marginLeft = '100px';
};
