$(document).ready(function(){
    getDepartmentList();
    getUserDetails();

    setTimeout(function(){
        $("#system-setting-main-menu").addClass("menu-open");
        $("#system-setting-menu").addClass("active");
        $("#manage-department-menu").attr("href","#");
        $("#manage-department-menu").addClass("active");
    },100)
})

var manageDepartmentIdx;
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
    var markUp = '<table id="manage-department-table" class="table table-striped table-bordered">\
                        <thead>\
                            <tr>\
                                <th>Image</th>\
                                <th>Name</th>\
                                <th>Department Head</th>\
                                <th>Status</th>\
                                <th style="width:50px;">Action</th>\
                            </tr>\
                        </thead>\
                        <tbody>';
    lists.forEach(function(list){
        var image = list.image;
        if(image == "" || image == undefined){
            image = baseUrl + "/system/images/blank-department.png";
        }
        markUp += '<tr>\
                        <td>\
                            <img src="'+ image +'" class="rounded-circle" width="40px" height="40px">\
                        </td>\
                        <td>'+list.name+'</td>\
                        <td>'+list.head+'</td>\
                        <td>'+list.status+'</td>\
                        <td>\
                            <button class="btn btn-success btn-sm" onclick="editDepartment(\''+ list.idx +'\')"><i class="fa fa-pencil"></i></button>\
                            <button class="btn btn-danger btn-sm" onclick="deleteDepartment(\''+ list.idx +'\')"><i class="fas fa-trash"></i></button>\
                        </td>\
                   </tr>';
    })
    markUp += '</tbody></table>';
    $("#manage-department-table-container").html(markUp);
    $("#manage-department-table").DataTable();
}

function addDepartment(){
    manageDepartmentIdx = "";
    $("#manage-department-add-edit-department-modal").modal("show");
    $("#manage-department-add-edit-department-modal-title").text("Create New Department");
}

function saveDepartment(){
    var image = $("#department-image").attr("src");
    var name = $("#department-name").val();
    var shortName = $("#department-shortname").val();
    var head = $("#department-head").val();
    var status = $("#department-status").val();

    if(!image.indexOf("data:image/png;base64") >= 0){
        image = "";
    }

    var error;
    if(name == "" || name == undefined){
        error = "*Name field should not be empty.";
    }else if(shortName == "" || shortName == undefined){
        error = "*Short name field should not be empty";
    }else if(head == "" || head == undefined){
        error = "*Department head field should not be empty.";
    }else{

        $.ajax({
            type: "POST",
            url: "save-department.php",
            dataType: 'html',
            data: {
                idx:manageDepartmentIdx,
                image:image,
                name:name,
                shortname:shortName,
                head:head,
                status:status
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    $("#manage-department-add-edit-department-modal").modal("hide");
                    clearAddEditDepartmentModal();
                    getDepartmentList();
                    alert(resp[1]);
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            }
        });
    }

    $("#save-department-error").text(error);
}

function clearAddEditDepartmentModal(){
    $("#department-image").attr("src", baseUrl + "/system/images/blank-department.png");
    $("#department-name").val("");
    $("#department-shortname").val("");
    $("#department-head").val("");
    $("#account-status").val("active");
    $("#save-department-error").text("");
}

function editDepartment(idx){
    manageDepartmentIdx = idx;
    $.ajax({
        type: "POST",
        url: "get-department-detail.php",
        dataType: 'html',
        data: {
            idx:idx
        },
        success: function(response){
            console.log(response);
            var resp = response.split("*_*");
            if(resp[0] == "true"){
                renderEditDepartment(resp[1]);
            }else if(resp[0] == "false"){
                alert(resp[1]);
            } else{
                alert(response);
            }
        }
    });
}

function renderEditDepartment(data){
    var lists = JSON.parse(data);
    lists.forEach(function(list){
        if(list.image != "" && list.image != undefined){
            $("#department-image").attr("src",list.image);
        }
        $("#department-name").val(list.name);
        $("#department-shortname").val(list.shortname);
        $("#department-head").val(list.head);
        $("#department-status").val(list.status);
    })
    $("#manage-department-add-edit-department-modal-title").text("Edit Department Details");
    $("#manage-department-add-edit-department-modal").modal("show");
}

function deleteDepartment(idx){
    if(confirm("Are you sure you want to delete this Depatment?\n\n This Action cannot be undone!")){
        $.ajax({
            type: "POST",
            url: "delete-department.php",
            dataType: 'html',
            data: {
                idx:idx
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    alert(resp[1]);
                    getDepartmentList();
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