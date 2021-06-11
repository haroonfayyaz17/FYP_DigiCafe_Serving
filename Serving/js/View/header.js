function getHeader(page) {
    var myvar;
    myvar = '<div class="header" id="header">' +
        '<div class="row">' +
        getLogo() + getTitle();
    if (page) {
        myvar += '<i class="fas fa-sign-out-alt signOut" data-toggle="tooltip" data-html="true" data-placement="top" title="Sign Out"></i>';
    }
    myvar += rest();
    document.write(myvar)
}

function rest() {
    return '</div>' +
        ' <br>' +
        getSubTitle() +
        '    </div>' +
        '    <br>';
}

function getTitle() {
    return '<h1>Digi Café Serving</h1>';
}

function getSubTitle() {
    return '<h4>Digitalized Cafe System to fulfil your needs! HAPPY ORDERING!!</h4>';
}

function getLogo() {
    return '<div class="img-circle"><img src="images/logo 2.png" alt="logo"></div>';
}