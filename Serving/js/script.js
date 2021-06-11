// import 'firebase/firestore';
// document.addEventListener('DOMContentLoaded', event => {
// import firebase from "../node_modules/firebase/app";
// import "../node_modules/firebase/auth";
$(document).ready(function() {
    var funID;
    var tags;
    var oDB;

    var login = localStorage.getItem('userLogin');
    if (login === 'login') {
        var object = JSON.parse(localStorage.getItem("expires"));
        var expire = new Date(object.timestamp);
        var now = new Date();
        if (now >= expire) {
            removeStorage();
            window.open("index.html", "_self");
        }
        tags = new MyTags();
        var barcodeImg = tags.getBarcodeTag()
        addBarcode();

        oDB = new OrderDBController();


        generate();

        oDB.checkSnapshot(funID);


    } else {
        window.open("index.html", "_self");
    }

    function removeStorage() {
        localStorage.removeItem("email");
        localStorage.removeItem("userLogin");
        localStorage.removeItem("expires");
    }

    function addBarcode() {
        $('#barcodeDiv').html(barcodeImg);
    }


    $(document).on('click', '.signOut', async function() {
        removeStorage();
        window.open("index.html", "_self");
    });




    $(document).on('click', '#btnDeliver', async function() {
        var id = $(this).data("id7");
        oDB.changeOrderStatus(id, 'past');
        $('#barcodeDiv').toggle();
        $('#barcodeDiv').html(barcodeImg);
        generate();
        $('#content').html('');
        $('#buttonP').html('');
        var cusID = $(this).data("id8");
        oDB.sendNotificationToUser(' Thanks for placing the order. Your order is collected from the counter. We hope you will enjoy this meal.', 'Order Delivered!', cusID);
    });

    $(document).on('click', '#btnGenerate', async function() {
        $('#barcodeDiv').toggle();
        $('#barcodeDiv').html(barcodeImg);
        generate();
        $('#content').html('');
        $('#buttonP').html('');

    });

    function makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }



    $(function() {
        $('[data-toggle="popover"]').popover({
            container: 'body'
        });
    });

    function generateBarCode(id) {
        var url = 'https://api.qrserver.com/v1/create-qr-code/?data=' + id + '&amp;size=300x300';
        $('#barcode').attr('src', url);
    }

    function qrProcedure() {
        var id = makeid(25);
        oDB.getBarcodes().push(id);
        generateBarCode(id);
    }

    function generate() {
        qrProcedure()
        funID = setInterval(function() {
            qrProcedure();
        }, 30 * 1000);
    }

});