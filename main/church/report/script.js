$(document).ready(function(){
    setTimeout(function(){
        $("#report-menu").attr("href","#");
        $("#report-menu").addClass("active");
    },100)
})

$(document).on('hidden.bs.modal', '.modal', function () {
    $('.modal.show').length && $(document.body).addClass('modal-open');
});

$(".modal").on("hidden.bs.modal",function(){
    $(this).find("form").trigger("reset");
    $('.modal-backdrop').remove();
})

var baseUrl = $("#base-url").text();
var userIdx;

getUserDetails();
getReportList();

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

function reportTypeChange(){
    var type = $("#report-type").val();
    $("#report-date-container").hide();
    $("#report-month-container").hide();
    $("#report-year-container").hide();
    if(type == "yearly"){
        $("#report-year-container").show();
        reportYearChange();
    }else if(type == "monthly"){
        $("#report-month-container").show();
        reportMonthChange();
    }else if(type == "daily"){
        $("#report-date-container").show();
        reportDateChange();
    }else if(type == "all"){
        getReportList();
    }
}

function getReportList(){
    $.ajax({
		type: "POST",
		url: "get-report-list.php",
		dataType: 'html',
		data: {
            dummy:"dummy"
		},
		success: function(response){
			var resp = response.split("*_*");
			if(resp[0] == "true"){
				renderReportList(resp[1]);
			}else if(resp[0] == "false"){
				alert(resp[1]);
			} else{
				alert(response);
			}
		}
	});
}

function reportYearChange(){
    var year = $("#report-year").val();
    $.ajax({
		type: "POST",
		url: "year-report-list.php",
		dataType: 'html',
		data: {
            year:year
		},
		success: function(response){
			var resp = response.split("*_*");
			if(resp[0] == "true"){
				renderReportList(resp[1]);
			}else if(resp[0] == "false"){
				alert(resp[1]);
			} else{
				alert(response);
			}
		}
	});
}

function reportMonthChange(){
    var month = $("#report-month").val();
    //alert(month);
    $.ajax({
		type: "POST",
		url: "month-report-list.php",
		dataType: 'html',
		data: {
            month:month
		},
		success: function(response){
			var resp = response.split("*_*");
			if(resp[0] == "true"){
				renderReportList(resp[1]);
			}else if(resp[0] == "false"){
				alert(resp[1]);
			} else{
				alert(response);
			}
		}
	});
}

function reportDateChange(){
    var date = $("#report-date").val();
    //alert(date);
    $.ajax({
		type: "POST",
		url: "date-report-list.php",
		dataType: 'html',
		data: {
            date:date
		},
		success: function(response){
			var resp = response.split("*_*");
			if(resp[0] == "true"){
				renderReportList(resp[1]);
			}else if(resp[0] == "false"){
				alert(resp[1]);
			} else{
				alert(response);
			}
		}
	});
}

function renderReportList(data){
    var lists = JSON.parse(data);
    var markUp = '<table id="report-table" class="table table-striped table-bordered table-sm">\
                        <thead>\
                            <tr>\
                                <th>Date</th>\
                                <th>Time</th>\
                                <th>Type</th>\
                                <th>Booked By</th>\
                                <th>Status</th>\
                            </tr>\
                        </thead>\
                        <tbody>';
    lists.forEach(function(list){
        var status = list.status;
        if(status == "processing"){
            activity = '<span class="badge badge-warning">Processing</span>';
        }else if(status == "apporved"){
            activity = '<span class="badge badge-success">Approved</span>';
        }else if(status == "declined"){
            activity = '<span class="badge badge-danger">Declined</span>';
        }
        markUp += '<tr>\
                        <td>'+list.date+'</td>\
                        <td>'+list.time+'</td>\
                        <td>'+list.type+'</td>\
                        <td>'+list.bookedby+'</td>\
                        <td>'+status+'</td>\
                   </tr>';
    })
    markUp += '</tbody></table>';
    $("#report-table-container").html(markUp);
    $("#report-table").DataTable();
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