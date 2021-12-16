$(document).ready(function() {
    setTimeout(function(){
        $("#manage-account-menu").attr("href","#");
        $("#manage-account-menu").addClass("active");
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
var accountIdx;
getAccountList();
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

function getAccountList(){
    $.ajax({
		type: "POST",
		url: "get-account-list.php",
		dataType: 'html',
		data: {
			dummy:"dummy"
		},
		success: function(response){
			var resp = response.split("*_*");
			if(resp[0] == "true"){
				renderAccountList(resp[1]);
			}else if(resp[0] == "false"){
				alert(resp[1]);
			} else{
				alert(response);
			}
		}
	});
}

function renderAccountList(data){
    var lists = JSON.parse(data);
    var markUp = '<table id="account-table" class="table table-striped table-bordered table-sm">\
                        <thead>\
                            <tr>\
                                <th>Name</th>\
                                <th>Username</th>\
                                <th>Access</th>\
                                <th>Church</th>\
                                <th style="max-width:50px;min-width:50px;">Action</th>\
                            </tr>\
                        </thead>\
                        <tbody>';
    lists.forEach(function(list){
        markUp += '<tr>\
                        <td>'+list.name+'</td>\
                        <td>'+list.username+'</td>\
                        <td>'+list.access+'</td>\
                        <td>'+list.church+'</td>\
                        <td>\
                            <button class="btn btn-success btn-sm" onclick="editAccount(\''+ list.idx +'\')"><i class="fa fa-pencil"></i></button>\
                            <button class="btn btn-danger btn-sm" onclick="deleteAccount(\''+ list.idx +'\')"><i class="fas fa-trash"></i></button>\
                        </td>\
                   </tr>';
    })
    markUp += '</tbody></table>';
    $("#account-table-container").html(markUp);
    $("#account-table").DataTable();
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
    var markUp = '<div class="form-group" id="account-church-container">\
                    <label for="account-church" class="col-form-label">Church:</label>\
                    <select class="form-control" id="account-church">\
                        <option value="">Select Church</option>';
    lists.forEach(function(list){
        markUp += '<option value="'+list.idx+'">'+list.name+'</option>';
    })

    markUp += '</select></div>';
    $("#account-church-select-container").html(markUp);
    $("#account-church-container").hide();
}

function accessChange(){
    $access = $("#account-access").val();
    if($access == "church"){
        $("#account-church-container").show();
    }else{
        $("account-church").val("");
        $("#account-church-container").hide();
    }
}

function addAccount(){
    accountIdx = "";
    $("#add-edit-account-modal").modal("show");
    accessChange();
}

function editAccount(idx){
    accountIdx = idx;
    $.ajax({
        type: "POST",
        url: "get-account-detail.php",
        dataType: 'html',
        data: {
            idx:idx
        },
        success: function(response){
            var resp = response.split("*_*");
            if(resp[0] == "true"){
                renderEditAccount(resp[1]);
            }else if(resp[0] == "false"){
                alert(resp[1]);
            } else{
                alert(response);
            }
        }
    });
}

function renderEditAccount(data){
    var lists = JSON.parse(data);
    lists.forEach(function(list){
        $("#account-name").val(list.name);
        $("#account-username").val(list.username);
        $("#account-access").val(list.access);
        $("#account-church").val(list.church);
        $("#add-edit-account-modal-title").text("Edit " + list.name + "'s Account Details");
        accessChange();
    })
    
    $("#add-edit-account-modal").modal("show");
}

function saveAccount(){
    var name = $("#account-name").val();
    var username = $("#account-username").val();
    var access = $("#account-access").val();
    var church = $("#account-church").val();

    var error = "";
    if(name == "" || name == undefined){
        error = "*Name field should not be empty.";
    }else if(username == "" || username == undefined){
        error = "*Username field should not be empty.";
    }else if(access == "" || access == undefined){
        error = "*Please select access level.";
    }else if(access == "church" && (church == "" || church == undefined)){
        error = "*Please select church";
    }else{
        $.ajax({
            type: "POST",
            url: "save-account.php",
            dataType: 'html',
            data: {
                idx:accountIdx,
                name:name,
                username:username,
                access:access,
                church:church
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    $("#add-edit-account-modal").modal("hide");
                    getAccountList();
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            }
        });
    }

    $("#add-edit-account-modal-error").text(error);
}

function deleteAccount(idx,name){
    if(confirm("Are you sure you want to delete this Account?\nThis Action cannot be undone!")){
        $.ajax({
            type: "POST",
            url: "delete-account.php",
            dataType: 'html',
            data: {
                idx:idx,
                name:name
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    getAccountList();
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