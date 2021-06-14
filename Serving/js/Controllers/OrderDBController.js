class OrderDBController {

    constructor() {
        var config = new FirebaseConfig();
        this.db = config.getFirestoreInstance();
        this.barcodes = [];

        this.loadingGif = '<img src="images/loader.gif" width="300" height="300" alt="loader"></img>';
        this.servingId = '';
        this.name = '';
    }

    getBarcodes() {
        return this.barcodes;
    }

    async getPersonInfo(email) {
        let personRef = await this.db.collection("Person").where('email', '==', email).get();
        for (var doc of personRef.docs) {
            var personDoc = doc.data();
            this.name = personDoc['Name'];
            this.servingId = doc.id;
        }
    }

    async fetchData(id) {
        var obj = this;
        obj.barcodes = [];
        var orders = [];
        var orderDoc;
        let ordersRef = await obj.db.collection("Orders").doc(id);
        await ordersRef.get().then(async function(doc) {
            if (doc.exists) {
                orderDoc = doc.data();
                var orderObj = new Order(doc.id, orderDoc['orderNo'], orderDoc['uid']);
                let itemsRef = await obj.db.collection("Orders").doc(doc.id).collection("Items").get();
                for (var doc2 of itemsRef.docs) {
                    var ItemDataFB = doc2.data();
                    if (ItemDataFB != null) {
                        var qty = ItemDataFB['quantity'];
                        var docRef = await obj.db.collection("Food Menu").doc(doc2.id);
                        await docRef.get().then(function(doc1) {
                            if (doc1.exists) {
                                var foodData = doc1.data();
                                if (foodData != null) {
                                    var foodObj = new FoodItem(foodData['name'], qty);
                                    orderObj.addOrderItem(foodObj);
                                }
                            } else {
                                console.log("No such document!");
                            }
                        });
                    }
                }
                orders.push(orderObj);
            }
        });
        var table = new Table();
        table.createTable(orders);
    }


    checkSnapshot(funID) {
        var obj = this;
        this.db.collection("QR")
            .onSnapshot({ includeMetadataChanges: false, fromCache: false }, function(snapshot) {
                snapshot.docChanges().forEach(function(change) {
                    if (!snapshot.metadata.hasPendingWrites) {
                        var data = change.doc.data();
                        var code = data['qrCode'];
                        if (obj.barcodes.includes(code)) {
                            $('#barcodeDiv').html(obj.loadingGif);
                            if (funID != null) {
                                clearInterval(funID);
                            }
                            var carIndex = obj.barcodes.indexOf(code);
                            obj.barcodes.splice(carIndex, 1);
                            obj.fetchData(change.doc.id);
                        }
                    }
                });
            });
    }

    async sendNotificationToUser(msg, title, cusID) {

        var personName, tokenID;
        var docRef1 = await this.db.collection("Person").doc(cusID);
        await docRef1.get().then(function(doc) {
            if (doc.exists) {
                var personData = doc.data();
                if (personData != null) {
                    personName = personData['Name'];
                    tokenID = personData['tokenID'];
                }
            }

        });
        if (tokenID != null && personName != null) {
            var api = new Firebase_Messaging();
            var body = "Hi! " + personName + ". " + msg;
            api.sendMsg(title, body, tokenID);
        }

        this.fetchData();
    }

    async changeOrderStatus(id, oStatus, servingId) {
        await this.db.collection("Orders").doc(id).update({
            'servedBy': servingId,
            'status': oStatus
        });

    }
}