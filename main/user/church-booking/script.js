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

$(document).on('hidden.bs.modal', '.modal', function () {
    $('.modal.show').length && $(document.body).addClass('modal-open');
});

var baseUrl = $("#base-url").text();
var bookingIdx;
var calendar;

getUserDetails();
getChurchList();
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

function getBookingList(church){
    //alert(church);
    $.ajax({
		type: "POST",
		url: "get-booking-list.php",
		dataType: 'html',
		data: {
			church:church
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
        var loginIdx = list.loginidx;
        var userIdx = list.useridx;
        if(loginIdx == userIdx){
            if(status == "processing"){
                event = {
                    title: list.church,
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
                    title: list.church,
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
                    title: list.church,
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
        }else{
            event = {
                title: list.name,
                color: '#C0C0C0',
                start: new Date(y,m,d),
                allDay: true,
                extendedProps: {
                    idx:"",
                    type: list.type,
                    status: list.status
                },
            }
        }
        calendar.addEvent(event);
    });
}

function getChurchList(){
    $.ajax({
		type: "POST",
		url: "get-church-list.php",
		dataType: 'html',
		data: {
			dummy:"dummy"
		},
		success: function(response){
			var resp = response.split("*_*");
			if(resp[0] == "true"){
				renderChurchList(resp[1]);
			}else if(resp[0] == "false"){
				alert(resp[1]);
			} else{
				alert(response);
			}
		}
	});
}

function renderChurchList(data){
    var lists = JSON.parse(data);
    var markUp = '<div class="input-group input-group-sm float-right w-25">\
                    <div class="input-group-prepend input-group-sm">\
                        <span class="input-group-text bg-success">Church</span>\
                    </div>\
                    <select class="form-control" id="booking-church" onchange="churchSelectChanged()">';
    lists.forEach(function(list){
        markUp += '<option value="'+list.idx+'">'+list.name+'</option>';
    })
    markUp += '</select></div>';
    $("#church-select-container").html(markUp);
    churchSelectChanged();
}

function churchSelectChanged(){
    var church = $("#booking-church").val();
    getBookingList(church);
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
            var idx = arg.event.extendedProps.idx;
            if(idx == ""){
                alert("You cannot view or edit this booking!");
            }else{
                bookingIdx = idx;
                $("#view-church").val(arg.event.title);
                $("#view-type").val(arg.event.extendedProps.type);
                $("#view-status").val(arg.event.extendedProps.status);
                $("#view-booking-modal").modal("show");
            }
        },
    })
    calendar.render();
}

function addBooking(date,church){
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    var bookDate = y+'-'+(m+1)+'-'+d;
    var currDate = new Date();
    date.setDate(date.getDate() + 1);

    if(date > currDate){
        $.ajax({
            type: "POST",
            url: "check-booking.php",
            dataType: 'html',
            data: {
                date:bookDate,
                church:church
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    $("#booking-date").val(bookDate);
                    $("#add-edit-booking-modal-title").text("Add New Booking");
                    $("#add-edit-booking-modal").modal("show");
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            }
        });
    }else{
        alert("Booking to an earlier date is not allowed!");
    }
}

function saveBooking(){
    var church = $("#booking-church").val();
    var type = $("#booking-type").val();
    var date = $("#booking-date").val();
    var error = "";

    if(church == "all"){
        error = "*Please select church!";
    }else if(type == "" || type == undefined){ 
        error = "*Please select a type of visit";
    }else{
        $.ajax({
            type: "POST",
            url: "save-booking.php",
            dataType: 'html',
            data: {
                church:church,
                type:type,
                date:date
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    $("#add-edit-booking-modal").modal("hide");
                    getBookingList(church);
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            }
        });
    }

    $("#add-edit-booking-modal-error").text(error);
}

function deleteBooking(){
    if(confirm("Are you sure you want to delete this booking?\nThis action cannot be undone.")){
        $.ajax({
            type: "POST",
            url: "delete-booking.php",
            dataType: 'html',
            data: {
                idx:bookingIdx,
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    $("#view-booking-modal").modal("hide");
                    var church = $("#booking-church").val();
                    getBookingList(church);
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