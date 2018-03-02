import '../style/style.css'
import print from './print.js'

function component() {
    console.log('------');
    print();
    var element = document.createElement('div');

    element.innerHTML = 'home';
    element.className = 'test';

    return element;
}

document.body.appendChild(component());