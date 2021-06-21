class Table {
    createTableHeaders() {
        return "<tr><th>Order Number</th><th>Ordered Items</th><th>Order Quantity</th></tr>";
    }

    createOrderNoRow(start, itemsCount, orderNo, end) {
        return start + "<td rowspan='" + itemsCount + "'>" + orderNo + "</td>" + end;
    }

    createNameAndQty(start, text, end) {
        return start + "<td>" + text + "</td>" + end;
    }

    createTable(orders) {
        if (orders.length > 0) {
            $('#barcodeDiv').toggle();
            var tableStart = "<table>";
            var tableHeader = this.createTableHeaders();
            var tableContent = ''
            tableContent += tableStart + tableHeader;
            for (var order of orders) {
                var itemsCount = order.foodItems.length;
                var orderNo = this.createOrderNoRow("<tr>", itemsCount, order.orderNo, '');
                tableContent += orderNo;
                for (var j = 0; j < order.foodItems.length; j++) {
                    var item = order.foodItems[j];
                    var itemName = this.createNameAndQty('', item.name, '');
                    var itemQty = this.createNameAndQty('', item.quantity, '');
                    if (j == 0) {
                        tableContent += itemName + itemQty;
                    } else {
                        tableContent += "<tr>" + itemName + itemQty + "</tr>"
                    }
                }
            }
            var tableEnd = "</table>";
            tableContent += tableEnd;
            $('#buttonP').html(this.createTableButton('', orders[0].id, order.cusID, ''));
            $('#content').html(tableContent);
        }
    }

    createTableButton(start, id, cusID, end) {
        var button = start + "<button type='button'  id=\"btnDeliver\" data-orderid='" + id + "' data-cusid='" + cusID + "'  class='btn btn-success'>Deliver</button>" + end;
        var button2 = start + "<button type='button'  id=\"btnGenerate\"  class='btn btn-info'>Generate QR</button>" + end;
        return button2 + button;
    }

}