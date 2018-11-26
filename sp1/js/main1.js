//For resetiing/reloading page
$(function() {
    $('#resetBtn').click(function() {
        $('#dynamic_field').find('input[type=text]').each(function() {
            var defaultVal = $(this).data('default');
            $(this).val(defaultVal);
        });
    });
});

$(document).ready(function() {
    function isNumber(event) {
        if ($.isNumeric(event)) {
            return true;
        } else {
            return false;
        }
    }
    var i = 1;

    $('#add').click(function() {
        if (i > 16) {
            alert("You Can enter only 16 inputs");
            return false;
        }
        // $('#dynamic_field').append('<tr id="row'+i+'" class="dynamic-added"><td><input type="text" name="sector_no" id="sector_no" size="1" style="border: 1px solid red;margin:0!important"></td><td><input type="text" name="coupon_no" id="coupon_no" size="1" style="border: 1px solid red;margin:0!important"></td><td><input type="text" name="from" id="from" size="7" style="border: 1px solid red;margin:0!important"></td><td><input type="text" name="to" id="to" size="7" style="border: 1px solid red;margin:0!important"></td><td><input type="text" name="cxr" id="cxr" size="4" style="border: 1px solid red;margin:0!important"></td><td><input type="text" name="fb" id="fb" size="10" style="border: 1px solid red;margin:0!important"></td><td><button type="button" name="remove" id="'+i+'" class="btn btn-sm btn-danger btn_remove">-</button></td></tr>');
        $('#dynamic_field').append('<tr id="row' + i + '" class="dynamic-added"><td><input type="text" name="sector_no" id="sector_no" size="1" style=""></td><td><input type="text" name="coupon_no" id="coupon_no" size="1" style=""></td><td><input type="text" name="from" id="from" size="7" style=""></td><td><input type="text" name="to" id="to" size="7" style=""></td><td><input type="text" name="cxr" id="cxr" size="4" style=""></td><td><input type="text" name="fb" id="fb" size="10" style=""></td><td><button type="button" name="remove" id="' + i + '" class="btn btn-sm btn-danger btn_remove"><b>-</b></button></td></tr>');
        i++;
    });

    $(document).on('click', '.btn_remove', function() {
        var button_id = $(this).attr("id");
        $('#row' + button_id + '').remove();
    });

    $(document).on('click', '#submit', function(event) {
        fareString = $('#fcaString').val();

        if (fareString.length <= 30) {
            alert('Your FCA string length is less than 30');
            return false;
        }
        var table = document.getElementById('myTBody');

        var dataToSend = {};
        var listOfCoupons = [];
        var gfp = {};
        for (var r = 0, n = table.rows.length; r < n; r++) {
            var rowNo = (r + 1);
            var docNo = table.rows[r].cells[0].children[0].value;
            var cpnNo = table.rows[r].cells[1].children[0].value;
            var origin = table.rows[r].cells[2].children[0].value;
            var destination = table.rows[r].cells[3].children[0].value;
            var cxr = table.rows[r].cells[4].children[0].value;
            if (fareBasis == "") {
                var fareBasis = null;
            } else {
                var fareBasis = table.rows[r].cells[5].children[0].value;
            }

            var obj = {};
            //validation
            if (docNo == '') {
                alert('You must enter doctor number at row ' + rowNo);
                return false;
            } else if (cpnNo == '') {
                alert('You must enter coupon number at row ' + rowNo);
                return false;
            } else if (origin == '') {
                alert('You must enter origin at row ' + rowNo);
                return false;
            } else if (destination == '') {
                alert('You must enter destination at row ' + rowNo);
                return false;
            } else if (cxr == '') {
                alert('You must enter cxr value at row ' + rowNo);
                return false;
            }

            obj["origin"] = origin.toUpperCase();
            obj["destination"] = destination.toUpperCase();
            obj["cxr"] = cxr.toUpperCase();
            obj["fareBasis"] = fareBasis;
            obj["docNo"] = docNo;
            obj["couponNo"] = cpnNo;
            listOfCoupons.push(obj);
        }
        dataToSend["gfp"] = gfp;
        gfp["listOfCoupons"] = listOfCoupons;
        dataToSend["fareString"] = fareString;

        //process the form
        $.ajax({
                type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
                url: 'http://10.245.240.102:8060/smartpra/proration/fca/enrichgfp', // the url where we want to POST
                // url         : 'http://10.111.25.165:8087/proration/fca/enrichgfp ', // the url where we want to POST
                contentType: "application/json",
                data: JSON.stringify(dataToSend), // our data object
                // dataType    : 'json', // what type of data do we expect back from the server
                // encode          : true,

                crossDomain: true
            })
            // using the done promise callback
            .done(function(data, textStatus, xhr) {
                // check if couponInfo and ticketLevelInfo is null. if null then display only exceptionerror message
                console.log(arguments);

                $("#result tbody").empty();
                $("#tbError tbody").empty();
                if (xhr.status == 200 && data.couponInfo != null && data.couponInfo.listOfCoupons != null) {
                    $('.error-result-table').hide();
                    $('.hidden').css("display", "block");
                    // console.log(arguments);
                    // console.log("status-code",xhr.status);
                    //to clear existed data in resultant table 
                    //$("#result td").empty();
                    console.log("event", event.status);
                    console.log("success data", data);
                    // document.write("success=>",JSON.stringify(data));
                    // var couponInfo = data.couponInfo;
                    var listOfCoupons = data.couponInfo.listOfCoupons;
                    var ticketLevelInfo = data.ticketLevelInfo;
                    var exceptionInfo = data.exceptionInfo;

                    var basicInfo = "";
                    for (var i = 0; i < listOfCoupons.length; i++) {
                        var insideCoupons = listOfCoupons[i];
                        basicInfo += " <tr>";
                        if (insideCoupons.couponType == null) {
                            basicInfo += "<td>" + "" + "</td>";
                        } else {
                            basicInfo += "<td>" + insideCoupons.couponType + "</td>";
                        }

                        if (insideCoupons.sideTripFlag == true) {
                            basicInfo += "<td>" + "Y" + "</td>";
                        } else {
                            basicInfo += "<td>" + "" + "</td>";
                        }

                        if (insideCoupons.transitFlag == true) {
                            basicInfo += "<td>" + "X/" + "</td>";
                        } else {
                            basicInfo += "<td>" + "" + "</td>";
                        }

                        basicInfo += "<td>" + insideCoupons.docNo + "</td>";
                        basicInfo += "<td>" + insideCoupons.couponNo + "</td>";
                        basicInfo += "<td>" + insideCoupons.sectorNo + "</td>";
                        basicInfo += "<td>" + insideCoupons.origin + "</td>";
                        basicInfo += "<td>" + insideCoupons.destination + "</td>";
                        basicInfo += "<td>" + insideCoupons.cxr + "</td>";
                        if (insideCoupons.fareBasis == null) {
                            basicInfo += "<td>" + "" + "</td>";
                        } else {
                            basicInfo += "<td>" + insideCoupons.fareBasis + "</td>";
                        }
                        basicInfo += "<td>" + insideCoupons.fcNo + "</td>";
                        if (insideCoupons.fareComponent == null) {
                            basicInfo += "<td>" + "" + "</td>";
                        } else {
                            basicInfo += "<td>" + insideCoupons.fareComponent + "</td>";
                        }

                        if (insideCoupons.btitFlag == true) {
                            basicInfo += "<td>" + "Y" + "</td>";
                        } else {
                            basicInfo += "<td>" + "" + "</td>";
                        }

                        if (insideCoupons.fcaCxr == null) {
                            basicInfo += "<td>" + "" + "</td>";
                        } else {
                            basicInfo += "<td>" + insideCoupons.fcaCxr + "</td>";
                        }
                        basicInfo += "</tr>";
                        basicInfo += "        ";
                        console.log("basicInfo", basicInfo);
                    }
                    $(".result> tbody:first").append(basicInfo);

                    // Get ticket level info details values//
                    var tktInfo = "";
                    tktInfo += "<tr>";
                    tktInfo += "  <th colspan='2'>Total Fare</th>";
                    if (ticketLevelInfo.totalFare["currency"] == null) {
                        tktInfo += "<td colspan='2'>" + " " + "</td>";
                    } else {
                        tktInfo += "<td colspan='2'>" + ticketLevelInfo.totalFare["currency"] + "</td>";
                    }

                    if (ticketLevelInfo.totalFare["totalFareAmount"] == null) {
                        tktInfo += "<td colspan='3'>" + " " + "</td>";
                    } else {
                        tktInfo += "  <td colspan='3'>" + ticketLevelInfo.totalFare["totalFareAmount"] + "</td>";
                    }

                    tktInfo += "  <td colspan='1'>ROE</td>";
                    if (ticketLevelInfo.totalFare["roe"] == null) {
                        tktInfo += "<td colspan='2'>" + "" + "</td>";
                    } else {
                        tktInfo += "  <td colspan='2'>" + ticketLevelInfo.totalFare["roe"] + "</td>";
                    }

                    tktInfo += "  <td colspan='1'>BT/IT</td>";
                    if (ticketLevelInfo.totalFare["btitFlag"] == true) {
                        tktInfo += "<td colspan='1'>" + "Y" + "</td>";
                    } else {
                        tktInfo += "<td colspan='1'>" + "N" + "</td>";
                    }

                    tktInfo += "<td colspan='1'>INVOL</td>";
                    if (ticketLevelInfo.totalFare["involFlag"] == true) {
                        tktInfo += "<td colspan='1'>" + "Y" + "</td>";
                    } else {
                        tktInfo += "<td colspan='1'>" + "N" + "</td>";
                    }
                    tktInfo += "</tr>";
                    tktInfo += "        ";
                    $(tktInfo).insertAfter($('table').find('.second-row'));

                    // Get Surcharge Values
                    var surchargeInfo = "";
                    var miscCharges = ticketLevelInfo.miscCharges;
                    if (miscCharges.surcharge.length > 0) {
                        for (var j = 0; j < miscCharges.surcharge.length; j++) {
                            surchargeInfo += " <tr>";
                            surchargeInfo += " <th colspan='2'>Q Surcharge</th>";
                            surchargeInfo += "<td>" + miscCharges.surcharge[j].fcNo + "</td>";
                            surchargeInfo += "<td>" + miscCharges.surcharge[j].cityPair + "</td>";
                            surchargeInfo += "<td>" + miscCharges.surcharge[j].surchargeAmount + "</td>";
                            surchargeInfo += "<td colspan='10'>" + "" + "</td>";
                            surchargeInfo += "</tr>";
                            surchargeInfo += "";
                        }
                        $(surchargeInfo).insertAfter($('table').find('.surcharge'));
                    } else {
                        surchargeInfo += " <tr>";
                        surchargeInfo += " <th colspan='2'>Q Surcharge</th>";
                        surchargeInfo += "<td colspan='13'>" + "" + "</td>";
                        surchargeInfo += "</tr>";
                        surchargeInfo += "        ";
                        // insert surcharge values//
                        $(surchargeInfo).insertAfter($('table').find('.surcharge'));
                    }

                    // Get ClassDifference Values
                    var classDiffInfo = "";
                    if (miscCharges.classDifference.length > 0) {
                        for (var j = 0; j < miscCharges.classDifference.length; j++) {
                            classDiffInfo += " <tr>";
                            classDiffInfo += " <th colspan='2'>Class Diff</th>";
                            classDiffInfo += "<td>" + "0" + "</td>";
                            classDiffInfo += "<td>" + miscCharges.classDifference[j].cityPair + "</td>";
                            classDiffInfo += "<td>" + miscCharges.classDifference[j].classDifferenceAmount + "</td>";
                            classDiffInfo += "<td colspan='10'>" + "" + "</td>";
                            classDiffInfo += "</tr>";
                            classDiffInfo += "        ";
                            // insert ClassDifference values//
                            $(classDiffInfo).insertAfter($('table').find('.classDiffInfo'));
                        }
                    } else {
                        $(classDiffInfo).hide();
                    }

                    // Get StopOver Values
                    var stopOverInfo = "";
                    if (miscCharges.stopover.length > 0) {
                        for (var j = 0; j < miscCharges.stopover.length; j++) {
                            stopOverInfo += " <tr>";
                            stopOverInfo += " <th colspan='2'>Stopover</th>";
                            stopOverInfo += "<td>" + miscCharges.stopover[j].fcNo + "</td>";
                            stopOverInfo += "<td>" + miscCharges.stopover[j].stopoverAmount + "</td>";
                            stopOverInfo += "<td colspan='10'>" + "" + "</td>";
                            stopOverInfo += "</tr>";
                            stopOverInfo += "        ";
                            // insert StopOver values//
                            $(stopOverInfo).insertAfter($('table').find('.stopover'));
                        }
                    } else {
                        $(stopOverInfo).hide();
                    }

                    // Get PLus values//
                    var plusInfo = "";
                    if (miscCharges["plus"] == null) {
                        $(plusInfo).hide();
                    } else {
                        plusInfo += "<tr>";
                        plusInfo += "<th colspan='2'>Plus</th>";
                        plusInfo += "<td colspan='2'>" + miscCharges["plus"] + "</td>";
                        plusInfo += "<td colspan='11'>" + "" + "</td>";
                        plusInfo += "<tr>";
                        plusInfo += "";
                        $(plusInfo).insertAfter($('table').find('.plusInfo'));
                    }

                    // Get Less values//
                    var lessInfo = "";
                    if (miscCharges["less"] == null) {
                        $(lessInfo).hide();
                    } else {
                        lessInfo += "  <tr>";
                        lessInfo += "  <th colspan='2'>Less</th>";
                        lessInfo += "<td colspan='2'>" + miscCharges["less"] + "</td>";
                        lessInfo += "</tr>";
                        lessInfo += "";
                        $(lessInfo).insertAfter($('table').find('.lessInfo'));
                    }

                    // Get Plusup values//
                    var plusUpInfo = "";
                    if (miscCharges["plusup"] == null) {
                        $(plusUpInfo).hide();
                    } else {
                        plusUpInfo += "<tr>";
                        plusUpInfo += "<th colspan='2'>Plus Up</th>";
                        plusUpInfo += "<td colspan='1'>" + "0" + "</td>";
                        plusUpInfo += "  <td colspan='2'>" + miscCharges.plusup["cityPair"] + "</td>";
                        plusUpInfo += "<td colspan='2'>" + miscCharges.plusup["plusupAmount"] + "</td>";
                        plusUpInfo += "<td colspan='8'>" + " " + "</td>";
                        plusUpInfo += "</tr>";
                        $(plusUpInfo).insertAfter($('table').find('.plusUpInfo'));
                    }

                    // get Exceptinal error message
                    var exceptionInfo = "";
                    console.log("exceptionInfo", data.exceptionInfo);
                    if (data.exceptionInfo.length > 0) {
                        for (var j = 0; j < data.exceptionInfo.length; j++) {
                            exceptionInfo += " <tr>";
                            exceptionInfo += "<td colspan='15'>" + data.exceptionInfo[j].errorDescription + "</td>";
                            exceptionInfo += "</tr>";
                            exceptionInfo += "        ";
                        }
                        $(exceptionInfo).insertAfter($('table').find('.exceptionInfo'));
                    } else {
                        $(exceptionInfo).hide();
                    }
                    console.log("exceptionInfo-log", exceptionInfo);
                }
                else 
                {
                  // if api response is null then display error message and hide rest table info
                  $('.result').hide();
                  $('.hidden').css("display", "block");
                  var exceptionInfo = "";
                  console.log("exceptionInfo-else-stmt", data.exceptionInfo);
                  if (data.exceptionInfo.length > 0) {
                      for (var j = 0; j < data.exceptionInfo.length; j++) {
                          exceptionInfo += " <tr>";
                          exceptionInfo += "<td colspan='15'>" + data.exceptionInfo[j].errorDescription + "</td>";
                          exceptionInfo += "</tr>";
                          exceptionInfo += "        ";
                      }
                      $(exceptionInfo).insertAfter($('.error-result-table').find('.exceptionInfo'));
                      // $(exceptionInfo).find('.error-message').show();                   
                  }
                }
            }).fail(function(data, textStatus, xhr) {
                //This shows status code eg. 403
                console.log("error", data.status);
                //This shows status message eg. Forbidden
                console.log("STATUS: " + xhr);

                alert("Your server is reponded as " + data.status);
            });
        // stop the form from submitting the normal way and refreshing the page
        event.preventDefault();
    });
});