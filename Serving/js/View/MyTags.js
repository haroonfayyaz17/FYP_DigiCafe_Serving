class MyTags {

    getBarcodeTag() {
        var barcodeImg = "<img id='barcode' ";
        barcodeImg += "src=\"https://api.qrserver.com/v1/create-qr-code/?data=HelloWorld&amp;size=300x300\" ";
        barcodeImg += "alt=\"barcode\" ";
        barcodeImg += "title=\"HELLO\" ";
        barcodeImg += "width=\"300\" ";
        barcodeImg += "height=\"300\" />";
        return barcodeImg;
    }
}