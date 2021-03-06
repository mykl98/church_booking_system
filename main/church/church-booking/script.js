$(document).ready(function() {
    setTimeout(function(){
        $("#church-booking-menu").attr("href","#");
        $("#church-booking-menu").addClass("active");
    },100)
})

/*============== Toggle Dropdown ==================*/
function toggle_menu(ele) {
    //close all ul with children class that are open except the one with the selected id
    $( '.children' ).not( document.getElementById(ele) ).slideUp("Normal");
    $( "#"+ele ).slideToggle("Normal");
    localStorage.setItem('lastTab', ele);
}

$(document).on('shown.lte.pushmenu', function(){
    $("#global-department-name").show();
})

$(document).on('collapsed.lte.pushmenu', function(){
    $("#global-department-name").hide();
})

$(".modal").on("hidden.bs.modal",function(){
    $(this).find("form").trigger("reset");
})

var baseUrl = $("#base-url").text();
var bookingIdx;

getUserDetails();
getBookingList();
renderCalendar();

function getUserDetails(){
    $.ajax({
        type: "POST",
        url: "get-profile-settings.php",
        dataType: 'html',
        data: {
            dummy:"dummy"
        },
        success: function(response){
            var resp = response.split("*_*");
            if(resp[0] == "true"){
                renderUserDetails(resp[1]);
            }else if(resp[0] == "false"){
                alert(resp[1]);
            } else{
                alert(response);
            }
        }
    });
}

function renderUserDetails(data){
    var lists = JSON.parse(data);

    lists.forEach(function(list){
        if(list.image != ""){
            $("#global-user-image").attr("src", list.image);
        }
        $("#global-user-name").text(list.name);
    })

}

function getBookingList(){
    $.ajax({
		type: "POST",
		url: "get-booking-list.php",
		dataType: 'html',
		data: {
			dummy:"dummy"
		},
		success: function(response){
			var resp = response.split("*_*");
			if(resp[0] == "true"){
                calendar.destroy();
                renderCalendar();
				renderBookingList(resp[1]);
			}else if(resp[0] == "false"){
				alert(resp[1]);
			} else{
				alert(response);
			}
		}
	});
}

function renderBookingList(data){
    //alert(data);
    var lists = JSON.parse(data);
    var event = {};
    lists.forEach(function(list){
        var date = new Date(list.date);
        var d = date.getDate();
	    var m = date.getMonth();
	    var y = date.getFullYear();
        var status = list.status;
        if(status == "processing"){
            event = {
                title: list.name,
                color: '#f0ad4e',
                start: new Date(y,m,d),
                allDay: true,
                extendedProps: {
                    idx:list.idx,
                    type: list.type,
                    status: list.status
                },
            }
        }else if(status == "approved"){
            event = {
                title: list.name,
                color: '#5cb85c',
                start: new Date(y,m,d),
                allDay: true,
                extendedProps: {
                    idx:list.idx,
                    type: list.type,
                    status: list.status
                },
            }
        }else if(status == "declined"){
            event = {
                title: list.name,
                color: '#d9534f',
                start: new Date(y,m,d),
                allDay: true,
                extendedProps: {
                    idx:list.idx,
                    type: list.type,
                    status: list.status
                },
            }
        }
        calendar.addEvent(event);
    });
}

function renderCalendar(){
    var calendarContainer = document.getElementById("calendar");

    calendar = new FullCalendar.Calendar(calendarContainer,{
        selectable: true,
        select: function(arg){
            var church = $("#booking-church").val();
            calendar.unselect();
            if(church != "all"){
                addBooking(arg["start"],church);
            }else{
                alert("Please select church!");
            }
        },
        eventClick: function(arg){
            bookingIdx = arg.event.extendedProps.idx;
            $("#view-name").val(arg.event.title);
            $("#view-type").val(arg.event.extendedProps.type);
            $("#view-status").val(arg.event.extendedProps.status);
            $("#view-booking-modal").modal("show");
        },
    })
    calendar.render();
}

function approveBooking(){
    if(confirm("Are you sure you want to approve this booking?")){
        $.ajax({
            type: "POST",
            url: "approve-booking.php",
            dataType: 'html',
            data: {
                idx:bookingIdx,
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    getBookingList();
                    $("#view-booking-modal").modal("hide");
                    //alert(resp[1]);
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            }
        });
    }
}

function declineBooking(){
    if(confirm("Are you sure you want to decline this booking?")){
        $.ajax({
            type: "POST",
            url: "decline-booking.php",
            dataType: 'html',
            data: {
                idx:bookingIdx
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    getBookingList();
                    $("#view-booking-modal").modal("hide");
                    //alert(resp[1]);
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            }
        });
    }
}

function logout(){
    $.ajax({
        type: "POST",
        url: "logout.php",
        dataType: 'html',
        data: {
            dummy:"dummy"
        },
        success: function(response){
            var resp = response.split("*_*");
            if(resp[0] == "true"){
                window.open(baseUrl + "/index.php","_self")
            }else if(resp[0] == "false"){
                alert(resp[1]);
            } else{
                alert(response);
            }
        }
    });
}