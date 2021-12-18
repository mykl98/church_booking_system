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

getUserDetails();
getBookingList();
getChurchList();

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
    var lists = JSON.parse(data);
    var markUp = '<table id="booking-table" class="table table-striped table-bordered table-sm">\
                        <thead>\
                            <tr>\
                                <th>Church</th>\
                                <th>Type</th>\
                                <th>Date</th>\
                                <th>Time</th>\
                                <th>Status</th>\
                                <th></th>\
                            </tr>\
                        </thead>\
                        <tbody>';
    lists.forEach(function(list){
        var status = list.status;
        var button = "";
        if(status == "approved"){
            status = '<span class="badge badge-success">Approved</span>';
        }else if(status == "processing"){
            status = '<span class="badge badge-warning">Processing</span>';
            button = '<button class="btn btn-success btn-sm" onclick="editBooking(\''+ list.idx +'\')"><i class="fa fa-pencil"></i></button>\
                      <button class="btn btn-danger btn-sm" onclick="deleteBooking(\''+ list.idx +'\')"><i class="fa fa-trash"></i></button>';
        }
        markUp += '<tr>\
                        <td>'+list.church+'</td>\
                        <td>'+list.type+'</td>\
                        <td>'+list.date+'</td>\
                        <td>'+list.time+'</td>\
                        <td>'+status+'</td>\
                        <td>'+button+'</td>\
                   </tr>';
    })
    markUp += '</tbody></table>';
    $("#booking-table-container").html(markUp);
    $("#booking-table").DataTable();
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
    var markUp = '<table id="booking-church-table" class="table table-striped table-bordered table-sm">\
                        <thead>\
                            <tr>\
                                <th>Name</th>\
                                <th>Address</th>\
                                <th></th>\
                            </tr>\
                        </thead>\
                        <tbody>';
    lists.forEach(function(list){
        markUp += '<tr>\
                        <td>'+list.name+'</td>\
                        <td>'+list.address+'</td>\
                        <td>\
                            <button class="btn btn-success btn-sm" onclick="churchSelected(\''+ list.idx +'\',\''+list.name+'\')"><i class="fa fa-check"></i></button>\
                        </td>\
                   </tr>';
    })
    markUp += '</tbody></table>';
    $("#booking-church-table-container").html(markUp);
    $("#booking-church-table").DataTable();
}

function addBooking(){
    bookingIdx = "";
    $("#add-edit-booking-modal-title").text("Add New Booking");
    $("#add-edit-booking-modal").modal("show");
}

function loadChurchList(){
    $("#church-select-modal").modal("show");
}

function churchSelected(idx,name){
    $("#church-select-modal").modal("hide");
    $("#booking-church").val(name);
    $("#booking-churchidx").val(idx);
}

function editBooking(idx){
    bookingIdx = idx;
    $.ajax({
        type: "POST",
        url: "get-booking-detail.php",
        dataType: 'html',
        data: {
            idx:bookingIdx
        },
        success: function(response){
            var resp = response.split("*_*");
            if(resp[0] == "true"){
                renderEditBooking(resp[1]);
            }else if(resp[0] == "false"){
                alert(resp[1]);
            } else{
                alert(response);
            }
        }
    });
}

function renderEditBooking(data){
    var lists = JSON.parse(data);
    lists.forEach(function(list){
        $("#booking-churchidx").val(list.churchidx);
        $("#booking-church").val(list.church);
        $("#booking-type").val(list.type);
        $("#booking-date").val(list.date);
        $("#booking-time").val(list.time);
    })
    $("#add-edit-booking-modal-title").text("Edit Booking");
    $("#add-edit-booking-modal").modal("show");
}

function saveBooking(){
    var churchIdx = $("#booking-churchidx").val();
    var type = $("#booking-type").val();
    var date = $("#booking-date").val();
    var time = $("#booking-time").val();
    var error = "";

    if(churchIdx == "" || churchIdx == undefined){
        error = "*Please select church to visit";
    }else if(type == "" || type == undefined){ 
        error = "*Please select a type of visit";
    }else if(date == "" || date == undefined){
        error = "*Date field should not be empty!";
    }else if(time == "" || time == undefined){
        error = "*Time field should not be empty!";
    }else{
        $.ajax({
            type: "POST",
            url: "save-booking.php",
            dataType: 'html',
            data: {
                idx:bookingIdx,
                churchidx:churchIdx,
                type:type,
                date:date,
                time:time
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    $("#add-edit-booking-modal").modal("hide");
                    getBookingList();
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

function deleteBooking(idx){
    if(confirm("Are you sure you want to delete this booking?\nThis action cannot be undone.")){
        $.ajax({
            type: "POST",
            url: "delete-booking.php",
            dataType: 'html',
            data: {
                idx:idx,
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    getBookingList();
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