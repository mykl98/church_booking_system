$(document).ready(function() {
    getUserDetails();
    getDesignationList();

    setTimeout(function(){
        $("#system-setting-main-menu").addClass("menu-open");
        $("#system-setting-menu").addClass("active");
        $("#manage-designation-menu").attr("href","#");
        $("#manage-designation-menu").addClass("active");
    },100)
})

var manageDesignationIdx;
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
    var markUp = '<table id="manage-designation-table" class="table table-striped table-bordered">\
                        <thead>\
                            <tr>\
                                <th>Name</th>\
                                <th>Status</th>\
                                <th style="width:50px";>Action</th>\
                            </tr>\
                        </thead>\
                        <tbody>';
    lists.forEach(function(list){
        markUp += '<tr>\
                        <td>'+list.name+'</td>\
                        <td>'+list.status+'</td>\
                        <td>\
                            <button class="btn btn-success btn-sm" onclick="editDesignation(\''+ list.idx +'\')"><i class="fa fa-pencil"></i></button>\
                            <button class="btn btn-danger btn-sm" onclick="deleteDesignation(\''+ list.idx +'\')"><i class="fas fa-trash"></i></button>\
                        </td>\
                   </tr>';
    })
    markUp += '</tbody></table>';
    $("#manage-designation-table-container").html(markUp);
    $("#manage-designation-table").DataTable();
}

function addDesignation(){
    manageDesignationIdx = "";
    $("#manage-designation-add-edit-designation-modal").modal("show");
}

function editDesignation(idx){
    manageDesignationIdx = idx;
    $.ajax({
		type: "POST",
		url: "get-designation-detail.php",
		dataType: 'html',
		data: {
			idx:manageDesignationIdx
		},
		success: function(response){
			var resp = response.split("*_*");
			if(resp[0] == "true"){
				renderEditDesignation(resp[1]);
			}else if(resp[0] == "false"){
				alert(resp[1]);
			} else{
				alert(response);
			}
		}
	});
}

function renderEditDesignation(data){
    var lists = JSON.parse(data);
    lists.forEach(function(list){
        $("#designation-name").val(list.name);
        $("#designation-status").val(list.status);
    });

    $("#manage-designation-add-edit-designation-modal").modal("show");
    $("#manage-designation-add-edit-designation-moda-title").text("Edit Designation Details");
}

function saveDesignation(){
    var name = $("#designation-name").val();
    var status = $("#designation-status").val();
    var error;
    if(name == "" || name == undefined){
        error = "*Designation name field should not be blank";
    }else{
        $.ajax({
            type: "POST",
            url: "save-designation.php",
            dataType: 'html',
            data: {
                idx:manageDesignationIdx,
                name: name,
                status:status
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    $("#manage-designation-add-edit-designation-modal").modal("hide");
                    getDesignationList();
                    clearAddEditDesignationModal();
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            }
        });
    }
    $("#add-edit-designation-modal-error").text(error);
}

function clearAddEditDesignationModal(){
    $("#designation-name").val("");
    $("#designation-status").val("active");
}

function deleteDesignation(idx){
    if(confirm("Are you sure you want to delete this designation?\nThis action cannot be undone")){
        $.ajax({
            type: "POST",
            url: "delete-designation.php",
            dataType: 'html',
            data: {
                idx:idx
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    getDesignationList();
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
