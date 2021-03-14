// import firebase from 'firebase/app';
// import 'firebase/firestore';
// document.addEventListener('DOMContentLoaded', event => {
$(document).ready(function() {
    var funID;
    var barcodes = [];
    var barcodeImg = "<img id='barcode' ";
    barcodeImg += "src=\"https://api.qrserver.com/v1/create-qr-code/?data=HelloWorld&amp;size=300x300\" ";
    barcodeImg += "alt=\"barcode\" ";
    barcodeImg += "title=\"HELLO\" ";
    barcodeImg += "width=\"300\" ";
    barcodeImg += "height=\"300\" />";

    var loadingGif = '<img src="images/loader.gif" width="300" height="300" alt="loader"></img>';
    $('#barcodeDiv').html(barcodeImg);


    var firebaseConfig = {
        apiKey: "AIzaSyDtGSEeL5misb5sC1_UFcwY4lO7eUf-GNg",
        authDomain: "digi-cafe-2.firebaseapp.com",
        projectId: "digi-cafe-2",
        storageBucket: "digi-cafe-2.appspot.com",
        messagingSenderId: "384720655745",
        appId: "1:384720655745:web:3f66a2f1f03e1b59808480",
        measurementId: "G-D72VM43NBK"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    // firebase.analytics();
    const db = firebase.firestore();


    async function fetchData(id) {
        barcodes = [];

        var orders = [];

        let ordersRef = await db.collection("Orders").doc(id);

        await ordersRef.get().then(async function(doc) {

            // console.log(`${doc.id} => ${doc.data()}`);
            var orderDoc = doc.data();

            var orderObj = new Order(doc.id, orderDoc['orderNo']);

            let itemsRef = await db.collection("Orders").doc(doc.id).collection("Items").get();
            // console.log(querySnapshot2.size);
            for (var doc2 of itemsRef.docs) {
                // console.log(`${doc2.id} => ${doc2.data()}`);
                var ItemDataFB = doc2.data();
                if (ItemDataFB != null) {
                    var qty = ItemDataFB['quantity'];
                    var docRef = await db.collection("Food Menu").doc("All").collection("Foods").doc(doc2.id);
                    await docRef.get().then(function(doc) {
                        if (doc.exists) {

                            var foodData = doc.data();
                            if (foodData != null) {
                                // console.log(foodData['name']+' '+orderDoc['orderNo']);
                                var foodObj = new FoodItem(foodData['name'], qty);
                                orderObj.addOrderItem(foodObj);
                            }
                        } else {
                            // doc.data() will be undefined in this ca
                            console.log("No such document!");
                        }

                    });
                }
            }
            orders.push(orderObj);
            // console.log(order['dateTime']+' '+order['status']);

        });
        createTable(orders);

    }

    function createTableHeaders() {
        var tableHeader = "<tr><th>Order Number</th><th>Ordered Items</th><th>Order Quantity</th></tr>";
        return tableHeader;
    }

    function createOrderNoRow(start, itemsCount, orderNo, end) {
        var orderNo = start + "<td rowspan='" + itemsCount + "'>" + orderNo + "</td>" + end;
        return orderNo;
    }

    function createNameAndQty(start, text, end) {
        var text1 = start + "<td>" + text + "</td>" + end;
        return text1;
    }

    function createTable(orders) {
        if (orders.length > 0) {
            $('#barcodeDiv').toggle();
            var tableStart = "<table>";
            var tableHeader = createTableHeaders();
            var tableContent = ''
            tableContent += tableStart + tableHeader;
            var rowsData = "";
            // $('#content').toggle();

            for (var i = 0; i < orders.length; i++) {
                var itemsCount = orders[i].foodItems.length;
                var orderNo = createOrderNoRow("<tr>", itemsCount, orders[i].orderNo, '');
                tableContent += orderNo;
                for (var j = 0; j < orders[i].foodItems.length; j++) {

                    var item = orders[i].foodItems[j];
                    var itemName = createNameAndQty('', item.name, '');
                    var itemQty = createNameAndQty('', item.quantity, '');
                    if (j == 0) {
                        tableContent += itemName + itemQty;

                        // tableContent+=createTableButton('',itemsCount,orders[i].id,'</tr>');
                    } else {
                        tableContent += "<tr>" + itemName + itemQty + "</tr>"
                    }
                }

            }
            var tableEnd = "</table>";
            tableContent += tableEnd;
            $('#buttonP').html(createTableButton('', itemsCount, orders[0].id, ''));
            $('#content').html(tableContent);
        }
    }

    $(document).on('click', '#btnDeliver', async function() {
        var id = $(this).data("id7");
        // var db = firebase.firestore();

        await db.collection("Orders").doc(id).update({ status: "delivered" });
        $('#barcodeDiv').toggle();
        $('#barcodeDiv').html(barcodeImg);
        generate();
        $('#content').html('');
        $('#buttonP').html('');
        var cusID;
        var docRef = await db.collection("Orders").doc(id);
        await docRef.get().then(function(doc) {
            if (doc.exists) {
                var orderData = doc.data();
                if (orderData != null) {
                    cusID = orderData['uid'];
                }
            } else {
                // doc.data() will be undefined in this ca
                console.log("cusId");
            }

        });
        var personName, tokenID;
        var docRef1 = await db.collection("Person").doc(cusID);
        await docRef1.get().then(function(doc) {
            if (doc.exists) {
                var personData = doc.data();
                if (personData != null) {
                    personName = personData['Name'];
                    tokenID = personData['tokenID'];
                }
            } else {
                // doc.data() will be undefined in this ca
                console.log("person");
            }

        });
        if (tokenID != null && personName != null) {
            var api = new Firebase_Messaging();
            var body = "Hi! " + personName + ", Thanks for placing the order. Your order is collected from the counter. We hope you will enjoy this meal.";
            api.sendMsg("Order Delivered!", body, "eFjShBqRQ9OdbuZMXFQp1d:APA91bHoPzstd6Yxu6WF_SNzG8HOfF3siWm5zEAmoDlu89_RoV_UzwAK19gQA2YrQc1fAPUAPs3aabPwvu8ixonDfEjGPLKbWikFEKnH9mXoGmjnMCjf8ExGBorJE2z9tEqg_MnRyEMZ");
        }
    });

    $(document).on('click', '#btnGenerate', async function() {
        $('#barcodeDiv').toggle();
        $('#barcodeDiv').html(barcodeImg);
        generate();
        $('#content').html('');
        $('#buttonP').html('');

    });

    function createTableButton(start, itemsCount, id, end) {
        var button = start + "<button type='button'  id=\"btnDeliver\" data-id7='" + id + "'  class='btn btn-success'>Deliver</button>" + end;
        var button2 = start + "<button type='button'  id=\"btnGenerate\"  class='btn btn-info'>Generate QR</button>" + end;

        return button2 + button;
    }

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
        // var nric = $('#text').val();
        var url = 'https://api.qrserver.com/v1/create-qr-code/?data=' + id + '&amp;size=300x300';
        $('#barcode').attr('src', url);
    }

    function qrProcedure() {
        var id = makeid(25);
        barcodes.push(id);
        generateBarCode(id);
    }

    function generate() {
        qrProcedure()
        funID = setInterval(function() {
            qrProcedure();
        }, 30 * 1000);
    }

    function checkSnapshot() {
        db.collection("QR")
            .onSnapshot({ includeMetadataChanges: false, fromCache: false }, function(snapshot) {
                snapshot.docChanges().forEach(function(change) {
                    if (!snapshot.metadata.hasPendingWrites) {
                        // console.log(change.type);
                        var data = change.doc.data();
                        var code = data['qrCode'];
                        if (barcodes.includes(code)) {
                            $('#barcodeDiv').html(loadingGif);
                            if (funID != null) {
                                clearInterval(funID);
                                // console.log('ues');
                            }
                            var carIndex = barcodes.indexOf(code);
                            barcodes.splice(carIndex, 1);
                            fetchData(change.doc.id);
                        }
                        // var source = snapshot.metadata.fromCache ? "local cache" : "server";
                        // console.log("Data came from " + source);

                    }

                });
            });
    }


    generate();

    checkSnapshot();

});