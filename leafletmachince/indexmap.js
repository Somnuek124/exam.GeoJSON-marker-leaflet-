//Map----------------------------------------------------------------------------------------------------------------------------
var indexMap = L.map('indexMap').setView([15, 100], 7);
var gl = L.mapboxGL({
  accessToken: 'pk.eyJ1IjoicGh1c2l0ciIsImEiOiJjazY3YzFxaXMwMTNjM21vdWlkbGJ6a2h5In0.JdD-PSvcCikzesyDNAlGlA',
  style: 'https://api.maptiler.com/maps/streets/style.json?key=auAhYrwneLv7vVJ6XYIZ'
}).addTo(indexMap);

//ScalOnMap----------------------------------------------------------------------------------------------------------------------
L.control.scale().addTo(indexMap);

//Show Polyline--------------------------------------------------------------------------------------------------------------------------
var pline;
$(document).ready(function () {
  // You need to be listening for the click on the id "addmap"
  $("#addmap").click(function () {

    var combobox = document.getElementById("cc1").value;
    if (!combobox) {
      toastr.warning('กรุณาเลือกเส้นทาง!', 'ไม่พบเส้นทางที่คุณเลือก', { timeOut: 5000 })
    }

    if (shpl.colum_trip.value) {
      var colum_trip = shpl.colum_trip.value;
      var combo_trip = shpl.combo_trip.value;
      // This captures the current selected DOM object
      var obj = $(this);
      // This will extract the value inside
      var objValue = obj.text();
      // This is where you send the data to a new page to get a response

      $.ajax({
        url: 'select_trip.php?colum_trip=' + colum_trip + '&combo_trip=' + combo_trip,
        type: 'GET',
        data: {
          'id': objValue
        },
        success: function (response) {

          var data = JSON.parse(response);
          var decode;
          if (data.end_trip_encode_polyline)
            decode = polyline.decode(data.end_trip_encode_polyline);
          if (data.start_trip_encode_polyline)
            decode = polyline.decode(data.start_trip_encode_polyline);
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
                opacity: 0.5,
                smoothFactor: 1
              });
              pline.addTo(indexMap);
            }
            if (data.end_trip_encode_polyline) {
              decode = polyline.decode(data.end_trip_encode_polyline);
              pline = new L.Polyline(decode, {
                color: 'blue',
                weight: 3,
                opacity: 0.5,
                smoothFactor: 1
              });
              pline.addTo(indexMap);
            }

          }
          //ในกรณีที่ยังไม่เพิ่มข้อมูลเส้นทาง
          if (data.end_trip_encode_polyline == null && data.start_trip_encode_polyline == null) {
            toastr.error('กรุณาเพิ่มข้อมูลเส้นทางก่อนเลือกดูข้อมูล', 'ไม่พบเส้นทางที่คุณเลือก', { timeOut: 5000 })
          }

        }
      });
      $('#dlgShowPolyline').dialog('close');
    }
  });
});
//--------------------------------------------------------------------------------------------------------------------------------