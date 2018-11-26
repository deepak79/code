//For resetiing/reloading page
$(function(){
  $('#resetBtn').click(function(){
     $('#dynamic_field').find('input[type=text]').each(function(){
    var defaultVal = $(this).data('default');
    $(this).val(defaultVal);
     });
  });
});

$(document).ready(function(){      
  // var postURL = "/addmore.php";
  // document.getElementById("form").reset();
  function isNumber(event){
    if($.isNumeric(event)){
        return true;
    }else{
        return false;
    }
  }
  var i=1;  
  $('#add').click(function(){  
    if(i>16){
    alert("You Can enter only 16 inputs");
    return false;
    }  
    // $('#dynamic_field').append('<tr id="row'+i+'" class="dynamic-added"><td><input type="text" name="sector_no" id="sector_no" size="1" style="border: 1px solid red;margin:0!important"></td><td><input type="text" name="coupon_no" id="coupon_no" size="1" style="border: 1px solid red;margin:0!important"></td><td><input type="text" name="from" id="from" size="7" style="border: 1px solid red;margin:0!important"></td><td><input type="text" name="to" id="to" size="7" style="border: 1px solid red;margin:0!important"></td><td><input type="text" name="cxr" id="cxr" size="4" style="border: 1px solid red;margin:0!important"></td><td><input type="text" name="fb" id="fb" size="10" style="border: 1px solid red;margin:0!important"></td><td><button type="button" name="remove" id="'+i+'" class="btn btn-sm btn-danger btn_remove">-</button></td></tr>');
    $('#dynamic_field').append('<tr id="row'+i+'" class="dynamic-added"><td><input type="text" name="sector_no" id="sector_no" size="1" style=""></td><td><input type="text" name="coupon_no" id="coupon_no" size="1" style=""></td><td><input type="text" name="from" id="from" size="7" style=""></td><td><input type="text" name="to" id="to" size="7" style=""></td><td><input type="text" name="cxr" id="cxr" size="4" style=""></td><td><input type="text" name="fb" id="fb" size="10" style=""></td><td><button type="button" name="remove" id="'+i+'" class="btn btn-sm btn-danger btn_remove"><b>-</b></button></td></tr>');  
    i++;
  });

  $(document).on('click', '.btn_remove', function(){  
    var button_id = $(this).attr("id");   
    $('#row'+button_id+'').remove();  
  });  

  $(document).on('click', '#submit', function(event){

                fcaString = $('#fcaString').val();

                if(fcaString.length <= 30)
                {
                    alert('Your FCA string length is less than 30');
                    return false;    
                }
                var table = document.getElementById('myTBody');

                var dataToSend = {};
                var listOfCoupons = [];
                var gfp = {};
                for (var r = 0, n = table.rows.length; r < n; r++) {
                    var rowNo = (r+1);
                    var docNo = table.rows[r].cells[0].children[0].value;
                    var cpnNo = table.rows[r].cells[1].children[0].value;
                    var origin = table.rows[r].cells[2].children[0].value;
                    var destination = table.rows[r].cells[3].children[0].value;
                    var cxr = table.rows[r].cells[4].children[0].value;
                    var fareBasis = table.rows[r].cells[5].children[0].value;
                    var obj = {};
                    //validation
                    if(docNo == ''){
                        alert('You must enter doctor number at row '+rowNo);
                        return false;
                    }else if(cpnNo == ''){
                        alert('You must enter coupon number at row '+rowNo);
                        return false;
                    }else if(origin == ''){
                        alert('You must enter origin at row '+rowNo);
                        return false;
                    }else if(destination == ''){
                        alert('You must enter destination at row '+rowNo);
                        return false;
                    }else if(cxr == ''){
                        alert('You must enter cxr value at row '+rowNo);
                        return false;
                    }else if(fareBasis == ''){
                        alert('You must enter fare basis value at row '+rowNo);
                        return false;
                    }
                    obj["origin"] = origin;
                    obj["destination"] = destination;
                    obj["cxr"] = cxr;
                    obj["fareBasis"] = fareBasis;
                    obj["docNo"] = docNo;
                    obj["couponNo"] = cpnNo;
                    listOfCoupons.push(obj);
                }
                dataToSend["gfp"] = gfp;
                dataToSend["listOfCoupons"] = listOfCoupons;
                dataToSend["fareString"] = fareString;

                //process the form
                $.ajax({
                    type        : 'GET', // define the type of HTTP verb we want to use (POST for our form)
                    url         : 'http://10.245.240.102:8060/smartpra/proration/fca/parse', // the url where we want to POST
                    data        : dataToSend, // our data object
                    // dataType    : 'json', // what type of data do we expect back from the server
                    // encode          : true,
                    contentType: "application/json",
                    crossDomain : true
                })
                    // using the done promise callback
                    .done(function(data) {
                        var itinerary = data.itinerary;
                        var listOfCoupons = itinerary.listOfCoupons;
                        var otherDetails = data.otherDetail;
                         var tr = "";  
                        var surchargeInfo = "";  
                        for(var i=0; i<listOfCoupons.length;i++){
                            var insideCoupons = listOfCoupons[i];
                            tr += " <tr>";
                            tr += "<td>" +" " + "</td>";
                            tr += "<td>" +" " + "</td>";
                            if (insideCoupons.isTransit==true) 
                            {
                               tr += "<td>" +"X/" + "</td>";
                            }
                            else
                            {
                                tr += "<td>" +" " + "</td>";
                            }
                            tr += "<td>"+" "+"</td>"; 
                            tr += "<td>"+" "+"</td>"; 
                            tr += "<td>"+" "+"</td>"; 
                            tr += "<td>"+insideCoupons.origin.airportCode+"</td>"; 
                            tr += "<td>"+insideCoupons.destination.airportCode+"</td>"; 
                            tr += "<td>"+insideCoupons.cxr+"</td>"; 
                            if (insideCoupons.couponExtraDetail.fareBasis!=null) 
                            {
                               tr += "<td>" +insideCoupons.couponExtraDetail.fareBasis + "</td>";
                            }
                            else
                            {
                                tr += "<td>" +" " + "</td>";
                            }
                            tr += "<td>" +" " + "</td>";
                            tr += "<td>" +insideCoupons.couponExtraDetail.fareComponent+ "</td>";
                            if(insideCoupons.couponExtraDetail.isBTIT==false)
                            {
                                tr += "<td>" +"" + "</td>";
                            }
                            else
                            {
                                 tr += "<td>" +"Y" + "</td>";
                            }
                            tr += "</tr>";
                            tr += " ";
                             // console.log("tr",tr)

                            // Get Surcharge Values
                            var couponExtraDetail = insideCoupons.couponExtraDetail;

                            if(couponExtraDetail.listOfSurcharges.length > 0)
                            {   
                                for(var j =0;j<couponExtraDetail.listOfSurcharges.length;j++)
                                {
                                    surchargeInfo += " <tr>";
                                    surchargeInfo += " <th colspan='1'>Q Surcharge</th>";
                                    surchargeInfo += "<td>"+couponExtraDetail.listOfSurcharges[j].atbpNo+"</td>";
                                    surchargeInfo += "<td>"+couponExtraDetail.listOfSurcharges[j].cityPair+"</td>"; 
                                    surchargeInfo += "<td>"+couponExtraDetail.listOfSurcharges[j].surchargeAmount+"</td>"; 
                                    surchargeInfo += "<td colspan='10'>"+""+"</td>"; 
                                    surchargeInfo += "</tr>";
                                    surchargeInfo += "        ";
                                    // insert surcharge values//
                                   // $(surchargeInfo).insertAfter($('table').find('.surcharge'));
                                } 
                            }

                            // Get ClassDifference Values
                            if(couponExtraDetail.listOfClassDifferences.length > 0)
                            {   
                                for(var j =0;j<couponExtraDetail.listOfClassDifferences.length;j++)
                                {
                                    var classDiffInfo = "";   
                                    classDiffInfo += " <tr>";
                                    classDiffInfo += " <th colspan='1'>Class Diff</th>";
                                    classDiffInfo += "<td>"+couponExtraDetail.listOfClassDifferences[j].classDifferenceAmount+"</td>"; 
                                    classDiffInfo += "<td>"+couponExtraDetail.listOfClassDifferences[j].cityPair+"</td>"; 
                                    classDiffInfo += "<td>"+couponExtraDetail.listOfClassDifferences[j].fcNo+"</td>"; 
                                    classDiffInfo += "<td colspan='10'>"+""+"</td>"; 
                                    classDiffInfo += "</tr>";
                                    classDiffInfo += "        ";
                                    // insert surcharge values//
                                    $(classDiffInfo).insertAfter($('table').find('.classDiffInfo'));
                                } 
                            }
                        }
                        $(".result> tbody:first").append(tr);
                        $(surchargeInfo).insertAfter($('table').find('.surcharge'));

                        // Get ticket info details values//
                        var tktInfo = "";
                        tktInfo += "  <tr>";
                        tktInfo += "  <th colspan='1'>Total Fare</th>";
                        if (otherDetails["currency"]==null) 
                        {
                            tktInfo += "<td colspan='2'>"+" "+"</td>";
                        }
                        else
                        {
                           tktInfo += "<td colspan='2'>"+otherDetails["currency"]+"</td>"; 
                        }
                        tktInfo += "  <td colspan='3'>"+otherDetails["totalFare"]+"</td>";
                        tktInfo += "  <td colspan='1'>ROE</td>";
                        tktInfo += "  <td colspan='2'>"+data.endPart["roe"]+"</td>";
                        tktInfo += "  <td colspan='1'>BT/IT</td>";

                        if (data.otherDetail["isBTIT"]==true) 
                        {
                            tktInfo += "<td colspan='1'>"+"Y"+"</td>";
                        }
                        else
                        {
                            tktInfo += "<td colspan='1'>"+"N"+"</td>";
                        }
                        tktInfo += "<td colspan='1'>INVOL</td>";
                        if (data.indicator["isInvol"]==true && data.indicator["isScheduleChange"]==false || data.indicator["isInvol"]==false && data.indicator["isScheduleChange"]==true) 
                        {
                            tktInfo += "<td colspan='1'>"+"Y"+"</td>";
                        }
                        else if(data.indicator["isInvol"]==false && data.indicator["isScheduleChange"]==false)
                        {
                            tktInfo += "<td colspan='1'>"+"N"+"</td>";
                        }
                        tktInfo += "</tr>";
                        tktInfo += "        ";
                        $(tktInfo).insertAfter($('table').find('.second-row'));

                        // Get PLus values//
                        var plusInfo = "";
                        if (otherDetails["plusAmount"]==0)
                        {
                            $(plusInfo).hide();
                        }
                        else
                        {
                            plusInfo += "<tr>";
                            plusInfo += "<th colspan='1'>Plus</th>";
                            plusInfo += "<td colspan='2'>"+otherDetails["plusAmount"]+"</td>";
                            plusInfo += "<td colspan='12'>"+otherDetails["plusAmount"]+"</td>"; 
                            plusInfo += "<tr>";
                            plusInfo += "";
                            $(plusInfo).insertAfter($('table').find('.plusInfo')); 
                        }
                        

                        // Get Less values//
                        var lessInfo = "";
                        if (otherDetails["lessAmount"]==0)
                        {
                            $(lessInfo).hide();
                        }
                        else
                        {   
                            lessInfo += "  <tr>";
                            lessInfo += "  <th colspan='1'>Less</th>";
                            lessInfo += "<td colspan='2'>"+otherDetails["lessAmount"]+"</td>";
                            lessInfo += "<td colspan='12'>"+otherDetails["lessAmount"]+"</td>"; 
                            lessInfo += "</tr>";
                            lessInfo += "";
                            $(lessInfo).insertAfter($('table').find('.lessInfo'));
                        }
                        

                        // Get PLusup values//
                        var plusUpInfo = "";
                        if (otherDetails["plusUpAmount"]==0) 
                        {
                            $(plusUpInfo).hide();
                        }
                        else
                        {
                            plusUpInfo += "  <tr>";
                            plusUpInfo += "  <th colspan='1'>Plus Up</th>"; 
                            plusUpInfo +="<td colspan='2'>"+otherDetails["plusUpAmount"]+"</td>"; 
                            plusUpInfo += "  <td colspan='2'>"+otherDetails["plusUpCityPair"]+"</td>";
                            plusUpInfo += "<td colspan='2'>"+" "+"</td>";
                            plusUpInfo += "</tr>";
                            $(plusUpInfo).insertAfter($('table').find('.plusUpInfo'));
                        }
                        
                        
                        $('.hidden').css("display", "block");
                        // here we will handle errors and validation messages
                        
                    })
                    .fail(function(data) {
                        alert("Enter valid input");
                    });

                // stop the form from submitting the normal way and refreshing the page
                event.preventDefault();
            });
});
