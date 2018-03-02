import '../style/reset.css'
import '../style/hello.scss'
import print from './print.js'

function component() {
    print();
    var element = document.createElement('div');

    element.innerHTML = 'Hello';
    element.className = 'test';

    return element;
}

document.body.appendChild(component());
console.log($);