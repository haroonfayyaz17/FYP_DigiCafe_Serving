// import firebase from 'firebase/app';
// import 'firebase/firestore';
// document.addEventListener('DOMContentLoaded', event => {
$(document).ready(function() {
    var funID;
    var barcodeImg = "<img id='barcode' ";
    barcodeImg += "src=\"https://api.qrserver.com/v1/create-qr-code/?data=HelloWorld&amp;size=300x300\" ";
    barcodeImg += "alt=\"barcode\" ";
    barcodeImg += "title=\"HELLO\" ";
    barcodeImg += "width=\"300\" ";
    barcodeImg += "height=\"300\" />";

    $('#barcodeDiv').html(barcodeImg);


    $(document).on('click', '#btnDeliver', async function() {
        var id = $(this).data("id7");
        oDB.changeOrderStatus(id, 'past');
        $('#barcodeDiv').toggle();
        $('#barcodeDiv').html(barcodeImg);
        generate();
        $('#content').html('');
        $('#buttonP').html('');
        var cusID = $(this).data("id8");
        oDB.sendNotificationToUser(', Thanks for placing the order. Your order is collected from the counter. We hope you will enjoy this meal.', 'Order Delivered!', cusID);
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


    var oDB = new OrderDBController();


    generate();

    oDB.checkSnapshot(funID);

});