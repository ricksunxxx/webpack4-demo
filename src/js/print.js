export default function printMe() {
    $(document).on('click', function (event) {
        event.preventDefault();
        alert('你点击了页面');
    });
    console.log('I get called from print.js!');
}