$(document).ready(function(){
    setTimeout(function(){
        $("#electronic-logbook-menu").attr("href","#");
        $("#electronic-logbook-menu").addClass("active");
    },100)
})

var baseUrl = $("#base-url").text();
var churchIdx;

getUserDetails();
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
    var markUp = '<div class="input-group input-group-sm float-right mr-2 w-25">\
                    <div class="input-group-prepend input-group-sm">\
                        <span class="input-group-text bg-success">Church</span>\
                    </div>\
                    <select id="church-select" class="form-control text-left" onchange="churchSelectChange()">';
    lists.forEach(function(list){
        markUp += '<option value="'+list.idx+'">'+list.name+'</option>';
    })
    markUp += '</select></div>';
    $("#church-select-container").html(markUp);
    churchSelectChange();
}

function churchSelectChange(){
    churchIdx = $("#church-select").val();
    getLogList();
}

function getLogList(){
    $.ajax({
		type: "POST",
		url: "get-log-list.php",
		dataType: 'html',
		data: {
			churchidx:churchIdx
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
    if(confirm("Are you sure you want to Clear the entire log history of this church?\nThis Action cannot be undone!")){
        $.ajax({
            type: "POST",
            url: "clear-log.php",
            dataType: 'html',
            data: {
                churchidx:churchIdx
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    getLogList(churchIdx);
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