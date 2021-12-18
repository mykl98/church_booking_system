$(document).ready(function(){
    setTimeout(function(){
        $("#electronic-logbook-menu").attr("href","#");
        $("#electronic-logbook-menu").addClass("active");
    },100)
})

var baseUrl = $("#base-url").text();
var userIdx;

getUserDetails();
getLogList();

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

function getLogList(){
    $.ajax({
		type: "POST",
		url: "get-log-list.php",
		dataType: 'html',
		data: {
			dummy:"dummy"
		},
		success: function(response){
			var resp = response.split("*_*");
			if(resp[0] == "true"){
				renderLogList(resp[1]);
			}else if(resp[0] == "false"){
				alert(resp[1]);
			} else{
				alert(response);
			}
		}
	});
}

function renderLogList(data){
    var lists = JSON.parse(data);
    var markUp = '<table id="log-table" class="table table-striped table-bordered table-sm">\
                        <thead>\
                            <tr>\
                                <th>Church</th>\
                                <th>User</th>\
                                <th>Date</th>\
                                <th>Time</th>\
                                <th>Activity</th>\
                            </tr>\
                        </thead>\
                        <tbody>';
    lists.forEach(function(list){
        var activity = list.activity;
        if(activity == "login"){
            activity = '<span class="badge badge-success">Login</span>';
        }else if(activity == "logout"){
            activity = '<span class="badge badge-danger">Logout</span>';
        }
        markUp += '<tr>\
                        <td>'+list.church+'</td>\
                        <td>'+list.user+'</td>\
                        <td>'+list.date+'</td>\
                        <td>'+list.time+'</td>\
                        <td>'+activity+'</td>\
                   </tr>';
    })
    markUp += '</tbody></table>';
    $("#log-table-container").html(markUp);
    $("#log-table").DataTable();
}

function clearLogs(idx){
    if(confirm("Are you sure you want to Clear the entire log history got this church?\nThis Action cannot be undone!")){
        $.ajax({
            type: "POST",
            url: "clear-log.php",
            dataType: 'html',
            data: {
                dummy:"dummy"
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    getLogList();
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            }
        });
    }
}

function scanQr(){
    $("#qr-reader-modal").modal("show");
}

function getUserDetail(qr){
    $.ajax({
		type: "POST",
		url: "get-user-detail.php",
		dataType: 'html',
		data: {
			qr:qr
		},
		success: function(response){
			var resp = response.split("*_*");
			if(resp[0] == "true"){
				renderUserDetail(resp[1]);
			}else if(resp[0] == "false"){
				alert(resp[1]);
			} else{
				alert(response);
			}
		}
	});
}

function renderUserDetail(data){
    var lists = JSON.parse(data);
    var markUp = '<table id="qr-booking-table" class="table table-striped table-bordered table-sm">\
                    <thead>\
                        <tr>\
                            <th>Type</th>\
                            <th>Time</th>\
                        </tr>\
                    </thead>\
                    <tbody>';
    lists.forEach(function(list){
        var bookings = JSON.parse(list.booking);
        bookings.forEach(function(book){   
            markUp += '<tr>\
                        <td>'+book.type+'</td>\
                        <td>'+book.time+'</td>\
                       </tr>';
        })
        
        userIdx = list.idx;
        $("#qr-name").val(list.name);
        $("#qr-address").val(list.address);
        var image = list.image;
        if(image != ""){
            $("#qr-image").attr("src",image);
        }
    })
    markUp += '</tbody></table>';
    $("#qr-booking-table-container").html(markUp);
    $("#qr-scan-modal").modal("show");
}

function qrLogin(){
    var error = "";
    if(userIdx == ""){
        error = "*Unable to login, No scanned user detected.";
    }else{
        if(confirm("Are your sure you want to logged in this user?")){
            $.ajax({
                type: "POST",
                url: "user-login-logout.php",
                dataType: 'html',
                data: {
                    idx:userIdx,
                    activity:"login"
                },
                success: function(response){
                    var resp = response.split("*_*");
                    if(resp[0] == "true"){
                        getLogList();
                    }else if(resp[0] == "false"){
                        alert(resp[1]);
                    } else{
                        alert(response);
                    }
                }
            });
        }
    }
}

function qrLogout(){
    var error = "";
    if(userIdx == ""){
        error = "*Unable to logout, No scanned user detected.";
    }else{
        if(confirm("Are your sure you want to log out this user?")){
            $.ajax({
                type: "POST",
                url: "user-login-logout.php",
                dataType: 'html',
                data: {
                    idx:userIdx,
                    activity:"logout"
                },
                success: function(response){
                    var resp = response.split("*_*");
                    if(resp[0] == "true"){
                        getLogList();
                    }else if(resp[0] == "false"){
                        alert(resp[1]);
                    } else{
                        alert(response);
                    }
                }
            });
        }
    }
    $("#qr-scan-modal-error").text(error);
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

var lastResult, countResults = 0;

function onScanSuccess(decodedText, decodedResult) {
    if (decodedText !== lastResult) {
        ++countResults;
        lastResult = decodedText;
        getUserDetail(decodedText);
        //console.log(`Scan result ${decodedText}`, decodedResult);
    }
}

var html5QrcodeScanner = new Html5QrcodeScanner(
    "qr-reader", { fps: 10, qrbox: 250 });
html5QrcodeScanner.render(onScanSuccess);