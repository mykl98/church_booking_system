$(document).ready(function(){
    getUserDetails();
    getUnitList();

    setTimeout(function(){
        $("#system-setting-main-menu").addClass("menu-open");
        $("#system-setting-menu").addClass("active");
        $("#manage-unit-menu").attr("href","#");
        $("#manage-unit-menu").addClass("active");
    },100)
})

var manageUnitIdx;
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

function getUnitList(){
    $.ajax({
		type: "POST",
		url: "get-unit-list.php",
		dataType: 'html',
		data: {
			dummy:"dummy"
		},
		success: function(response){
			var resp = response.split("*_*");
			if(resp[0] == "true"){
				renderUnitList(resp[1]);
			}else if(resp[0] == "false"){
				alert(resp[1]);
			} else{
				alert(response);
			}
		}
	});
}

function renderUnitList(data){
    var lists = JSON.parse(data);
    var markUp = '<table id="manage-unit-table" class="table table-striped table-bordered">\
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
                            <button class="btn btn-success btn-sm" onclick="editUnit(\''+ list.idx +'\')"><i class="fa fa-pencil"></i></button>\
                            <button class="btn btn-danger btn-sm" onclick="deleteUnit(\''+ list.idx +'\')"><i class="fas fa-trash"></i></button>\
                        </td>\
                   </tr>';
    })
    markUp += '</tbody></table>';
    $("#manage-unit-table-container").html(markUp);
    $("#manage-unit-table").DataTable();
}

function addUnit(){
    manageUnitIdx = "";
    $("#add-edit-unit-modal").modal("show");
}

function editUnit(idx){
    manageUnitIdx = idx;
    $.ajax({
		type: "POST",
		url: "get-unit-detail.php",
		dataType: 'html',
		data: {
			idx:manageUnitIdx
		},
		success: function(response){
			var resp = response.split("*_*");
			if(resp[0] == "true"){
				renderEditUnit(resp[1]);
			}else if(resp[0] == "false"){
				alert(resp[1]);
			} else{
				alert(response);
			}
		}
	});
}

function renderEditUnit(data){
    var lists = JSON.parse(data);
    lists.forEach(function(list){
        $("#unit-name").val(list.name);
        $("#unit-status").val(list.status);
    });

    $("#add-edit-unit-modal").modal("show");
    $("#add-edit-designation-moda-title").text("Edit Unit Details");
}

function saveUnit(){
    var name = $("#unit-name").val();
    var status = $("#unit-status").val();
    var error;
    if(name == "" || name == undefined){
        error = "*Unit name field should not be blank";
    }else{
        $.ajax({
            type: "POST",
            url: "save-unit.php",
            dataType: 'html',
            data: {
                idx:manageUnitIdx,
                name: name,
                status:status
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    $("#add-edit-unit-modal").modal("hide");
                    getUnitList();
                    clearAddEditUnitModal();
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            }
        });
    }
    $("#add-edit-unit-modal-error").text(error);
}

function clearAddEditUnitModal(){
    $("#unit-name").val("");
    $("#unit-status").val("active");
}

function deleteUnit(idx){
    if(confirm("Are you sure you want to delete this unit?\nThis action cannot be undone")){
        $.ajax({
            type: "POST",
            url: "delete-unit.php",
            dataType: 'html',
            data: {
                idx:idx
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    getUnitList();
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