$(document).ready(function() {
    var config = new FirebaseConfig();

    $('.alert').hide();
    $(".toggle-password").click(function() {

        $(this).toggleClass("fa-eye fa-eye-slash");
        var input = $('#signInPswd');
        if (input.attr("type") == "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }
    });

    $('#signIn').click(function() {
        $('.alert').hide();
        localStorage.removeItem("userLogin");
        localStorage.removeItem("expires");
        var email = $('#Email').val();
        if (!validateEmail(email)) {
            displayAlert('Invalid Email');
            return;
        }
        var password = $('#signInPswd').val();
        config.getFirebaseAuth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                localStorage.setItem("userLogin", "login");
                //This authentication key will expire in 1 hour.
                var today = new Date();
                today.setMinutes(today.getMinutes() + 20);
                var object = { value: "value", timestamp: today }
                localStorage.setItem("expires", JSON.stringify(object));

                window.location.replace("QR.html");
            })
            .catch((error) => {
                console.log(error);
                var errorCode = error.code;
                console.log(errorCode);
                if (errorCode == 'auth/wrong-password') {
                    displayAlert('Incorrect Password');

                } else if (errorCode == 'auth/user-not-found') {
                    displayAlert('Incorrect Email');
                }
            });

    });

    $('#resetPswd').click(function() {
        $('.alert').hide();

        var email = $('#EmailReset').val();
        if (!validateEmail(email)) {
            displayAlert('Invalid Email');
            return;
        }
        config.getFirebaseAuth().sendPasswordResetEmail(email)
            .then(() => {
                $('.alert').removeClass("alert-danger");
                $('.alert').addClass("alert-primary");

                displayAlert('A password reset email is sent to your provided email address');
                setTimeout(() => { window.location.replace('index.html'); }, 3000);

            })
            .catch((error) => {
                console.log(error);
                var errorCode = error.code;
                console.log(errorCode);
                if (errorCode == 'auth/user-not-found') {
                    displayAlert('Incorrect Email');
                }
            });

    });


    function displayAlert(msg) {
        $('.alert').show();
        $('.alert').html(msg);
    }

    function validateEmail(elementValue) {
        var emailPattern;
        emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(elementValue);
    }
});