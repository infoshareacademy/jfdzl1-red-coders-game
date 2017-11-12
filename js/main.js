document.addEventListener("DOMContentLoaded", function () {


    var element = document.createElement('div');
    element.id = 'hero';
    element.width = '20px';
    element.height = '20px';
    element.style.backgroundColor = '#FF0';

    var body = document.getElementsByTagName('body')[0];
    body.appendChild(element);
)
}
''