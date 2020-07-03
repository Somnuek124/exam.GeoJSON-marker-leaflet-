//Show Polyline--------------------------------------------------------------------------------------------------------------------------
var pline;
$(document).ready(function () {
  // You need to be listening for the click on the id "addmap"
  $("#addLinesTomap").click(function () {

    var combobox = document.getElementById("cBox_tripname").value;
    if (!combobox) {
      toastr.warning('กรุณาเลือกเส้นทาง!', 'ไม่พบเส้นทางที่คุณเลือก', { timeOut: 5000 })
    }

    if (Sh_Buslines.colum_trip.value) {
      var colum_trip = Sh_Buslines.colum_trip.value;
      var combo_trip = Sh_Buslines.combo_trip.value;
     
      // This captures the current selected DOM object
      var obj = $(this);
      // This will extract the value inside
      var objValue = obj.text();
      // This is where you send the data to a new page to get a response

      $.ajax({
        url: 'select_buslines.php?colum_trip=' + colum_trip + '&combo_trip=' + combo_trip,
        type: 'GET',
        data: {
          'id': objValue
        },
        success: function (response) {

          var data = JSON.parse(response);
          var decode;
          document.getElementById("sh_name").innerHTML = data.trip_name
          if (data.start_trip_encode_polyline)
            decode = polyline.decode(data.start_trip_encode_polyline);
          if (data.end_trip_encode_polyline)
            decode = polyline.decode(data.end_trip_encode_polyline);
          drawPolyline(decode);

          function drawPolyline(arrPolyline) {
            if (pline) {
              pline.removeFrom(indexMap);
            }
            if (data.start_trip_encode_polyline) {
              decode = polyline.decode(data.start_trip_encode_polyline);
              pline = new L.Polyline(decode, {
                color: 'red',
                weight: 3,
                opacity: 1,
                smoothFactor: 1
              });
              //แสดงเส้นในแผนที่
              pline.addTo(indexMap);
              //ให้แสดงพอดีกับหน้าจอ
              indexMap.fitBounds(pline.getBounds(), {
                padding: [50, 50]
              });
            }
            if (data.end_trip_encode_polyline) {
              decode = polyline.decode(data.end_trip_encode_polyline);
              pline = new L.Polyline(decode, {
                color: 'blue',
                weight: 3,
                opacity: 1,
                smoothFactor: 1
              });
              //แสดงเส้นในแผนที่
              pline.addTo(indexMap);
              //ให้แสดงพอดีกับหน้าจอ
              indexMap.fitBounds(pline.getBounds(), {
                padding: [50, 50]
              });
            }

          }
          //ในกรณีที่ยังไม่เพิ่มข้อมูลเส้นทาง
          if (data.end_trip_encode_polyline == null && data.start_trip_encode_polyline == null) {
            toastr.error('กรุณาเพิ่มข้อมูลเส้นทางก่อนเลือกดูข้อมูล', 'ไม่พบเส้นทางที่คุณเลือก', { timeOut: 5000 })
          }

        }
      });
      $('#dlgShowlines').dialog('close');
    }
  });
});
//--------------------------------------------------------------------------------------------------------------------------------