$(document).ready(function() {
    getAccountList();
    getUserDetails();
    getDepartmentList();
    getDesignationList();

    setTimeout(function(){
        $("#manage-account-menu").attr("href","#");
        $("#manage-account-menu").addClass("active");
    },100)
})

var baseUrl = $("#base-url").text();

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
    var markUp = '<table id="manage-account-table" class="table table-striped table-bordered">\
                        <thead>\
                            <tr>\
                                <th style="width:40px;">Image</th>\
                                <th>Name</th>\
                                <th>Username</th>\
                                <th>Access</th>\
                                <th>Department Access</th>\
                                <th>Status</th>\
                                <th>Action</th>\
                            </tr>\
                        </thead>\
                        <tbody>';
    lists.forEach(function(list){
        var image = list.image;
        if(image == "" || image == undefined){
            image = "../../../system/images/blank-profile.png";
        }
        markUp += '<tr>\
                        <td class="text-center">\
                            <img src="'+image+'" class="rounded-circle" width="35px">\
                        </td>\
                        <td>'+list.name+'</td>\
                        <td>'+list.username+'</td>\
                        <td>'+list.access+'</td>\
                        <td>'+list.deptaccess+'</td>\
                        <td>'+list.status+'</td>\
                        <td>\
                        <button class="btn btn-info btn-sm" onclick="viewPassword(\''+ list.idx +'\')"><i class="fa fa-key"></i></button>\
                            <button class="btn btn-success btn-sm" onclick="editAccount(\''+ list.idx +'\')"><i class="fa fa-pencil"></i></button>\
                            <button class="btn btn-danger btn-sm" onclick="deleteAccount(\''+ list.idx +'\')"><i class="fas fa-trash"></i></button>\
                        </td>\
                   </tr>';
    })
    markUp += '</tbody></table>';
    $("#manage-account-table-container").html(markUp);
    $("#manage-account-table").DataTable();
}

function getDepartmentList(){
    $.ajax({
		type: "POST",
		url: "get-department-list.php",
		dataType: 'html',
		data: {
			dummy:"dummy"
		},
		success: function(response){
			var resp = response.split("*_*");
			if(resp[0] == "true"){
				renderDepartmentList(resp[1]);
			}else if(resp[0] == "false"){
				alert(resp[1]);
			} else{
				alert(response);
			}
		}
	});
}

function renderDepartmentList(data){
    var lists = JSON.parse(data);
    var markUp = '<div class="form-group" id="account-department-container">\
                    <label for="account-department" class="col-form-label">Department:</label>\
                    <select class="form-control" id="account-department">\
                        <option value="">Select Department</option>';
    lists.forEach(function(list){
        markUp += '<option value="'+list.idx+'">'+list.name+'</option>';
    })

    markUp += '</select></div>';
    $("#account-department-select-container").html(markUp);
    $("#account-department-container").hide();
}

function getDesignationList(){
    $.ajax({
		type: "POST",
		url: "get-designation-list.php",
		dataType: 'html',
		data: {
			dummy:"dummy"
		},
		success: function(response){
			var resp = response.split("*_*");
			if(resp[0] == "true"){
				renderDesignationList(resp[1]);
			}else if(resp[0] == "false"){
				alert(resp[1]);
			} else{
				alert(response);
			}
		}
	});
}

function renderDesignationList(data){
    var lists = JSON.parse(data);
    var markUp = '<div class="form-group" id="account-designation-container">\
                    <label for="account-designation" class="col-form-label">Designation:</label>\
                    <select class="form-control" id="account-designation">\
                        <option value="">Select Designation</option>';
    lists.forEach(function(list){
        markUp += '<option value="'+list.idx+'">'+list.name+'</option>';
    })

    markUp += '</select></div>';
    $("#account-designation-select-container").html(markUp);
    $("#account-designation-container").hide();
}

function accessChange(){
    $access = $("#account-access").val();
    if($access == "department"){
        $("#account-department-container").show();
        $("#account-designation-container").show();
        $("#account-deptaccess-container").show();
    }else{
        $("#account-department-container").hide();
        $("#account-designation-container").hide();
        $("#account-deptaccess-container").hide();
    }
}

function addAccount(){
    manageAccountIdx = "";
    $("#add-edit-account-modal").modal("show");
    accessChange();
    $("#account-deptaccess").val("admin");
}

function saveAccount(){
    var name = $("#account-name").val();
    var username = $("#account-username").val();
    var access = $("#account-access").val();
    var deptAccess = $("#account-deptaccess").val();
    var department = $("#account-department").val();
    var designation = $("#account-designation").val();
    var status = $("#account-status").val();

    var error = "";
    if(name == "" || name == undefined){
        error = "*Name field should not be empty.";
    }else if(username == "" || username == undefined){
        error = "*Username field should not be empty.";
    }else if(access == "" || access == undefined){
        error = "*Please select access level.";
    }else if(access == "department" && (department == "" || department == undefined)){
        error = "*Please select department";
    }else if(access == "department" && deptAccess == "admin" && (designation == "" || designation == undefined)){
        error = "*Please select designation";
    }else{
        $.ajax({
            type: "POST",
            url: "save-account.php",
            dataType: 'html',
            data: {
                idx:manageAccountIdx,
                name:name,
                username:username,
                access:access,
                department:department,
                designation:designation,
                status:status
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    $("#add-edit-account-modal").modal("hide");
                    getAccountList();
                    clearAddEditAccountModal();
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            }
        });
    }

    $("#save-account-error").text(error);
}

function clearAddEditAccountModal(){
    $("#account-image").attr("src",baseUrl + "/system/images/blank-profile.png");
    $("#account-name").val("");
    $("#account-username").val("");
    $("#account-access").val("admin");
    $("#account-status").val("active");
}

function editAccount(idx){
    manageAccountIdx = idx;
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
        if(list.image != "" && list.image != undefined){
            $("#account-image").attr("src",list.image);
        }

        $("#account-name").val(list.name);
        $("#account-username").val(list.username);
        $("#account-access").val(list.access);
        $("#account-department").val(list.department);
        $("#account-deptaccess").val(list.deptaccess);
        $("#account-designation").val(list.designation);
        $("#account-status").val(list.status);

        $("#add-edit-account-modal-title").text("Edit " + list.name + "'s Account Details");
        accessChange();
        if(list.deptaccess == "admin"){
            $("#account-designation-container").show();
        }else{
            $("#account-designation-container").hide();
        }
    })
    
    $("#add-edit-account-modal").modal("show");
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

function viewPassword(idx){
    $.ajax({
        type: "POST",
        url: "view-password.php",
        dataType: 'html',
        data: {
            idx:idx,
            name:name
        },
        success: function(response){
            var resp = response.split("*_*");
            if(resp[0] == "true"){
                renderViewPassword(resp[1]);
            }else if(resp[0] == "false"){
                alert(resp[1]);
            } else{
                alert(response);
            }
        }
    });
}

function renderViewPassword(data){
    var lists = JSON.parse(data);
    lists.forEach(function(list){
        $("#view-password").val(list.password);
    })

    $("#view-password-modal").modal("show");
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