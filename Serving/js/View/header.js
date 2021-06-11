var myvar = '<div class="header" id="header">' +
    '<div class="row">' +
    getLogo() + getTitle() +
    '</div>' +
    ' <br>' +
    getSubTitle() +
    '    </div>' +
    '    <br>';



function getTitle() {
    return '<h1>Digi Café Serving</h1>';
}

function getSubTitle() {
    return '<h4>Digitalized Cafe System to fulfil your needs! HAPPY ORDERING!!</h4>';
}

function getLogo() {
    return '<div class="img-circle"><img src="images/logo 2.png" alt="logo"></div>';
}
document.write(myvar)