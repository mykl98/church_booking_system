$(document).ready(function(){
    setTimeout(function(){
        $("#manage-church-menu").attr("href","#");
        $("#manage-church-menu").addClass("active");
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

var churchIdx;
var baseUrl = $("#base-url").text();

getChurchList();
getUserDetails();

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
    var markUp = '<table id="church-table" class="table table-striped table-bordered table-sm">\
                        <thead>\
                            <tr>\
                                <th>Name</th>\
                                <th>Address</th>\
                                <th>Description</th>\
                                <th style="min-width:50px;max-width:50px;">Action</th>\
                            </tr>\
                        </thead>\
                        <tbody>';
    lists.forEach(function(list){
        markUp += '<tr>\
                        <td>'+list.name+'</td>\
                        <td>'+list.address+'</td>\
                        <td>'+list.description+'</td>\
                        <td>\
                            <button class="btn btn-success btn-sm" onclick="editChurch(\''+ list.idx +'\')"><i class="fa fa-pencil"></i></button>\
                            <button class="btn btn-danger btn-sm" onclick="deleteChurch(\''+ list.idx +'\')"><i class="fas fa-trash"></i></button>\
                        </td>\
                   </tr>';
    })
    markUp += '</tbody></table>';
    $("#church-table-container").html(markUp);
    $("#church-table").DataTable();
}

function addChurch(){
    churchIdx = "";
    $("#add-edit-church-modal").modal("show");
    $("#add-edit-church-modal-title").text("Add New Church");
}

function editChurch(idx){
    churchIdx = idx;
    $.ajax({
        type: "POST",
        url: "get-church-detail.php",
        dataType: 'html',
        data: {
            idx:idx
        },
        success: function(response){
            var resp = response.split("*_*");
            if(resp[0] == "true"){
                renderEditChurch(resp[1]);
            }else if(resp[0] == "false"){
                alert(resp[1]);
            } else{
                alert(response);
            }
        }
    });
}

function renderEditChurch(data){
    var lists = JSON.parse(data);
    lists.forEach(function(list){
        $("#church-name").val(list.name);
        $("#church-address").val(list.address);
        $("#church-description").val(list.description);
    })
    $("#add-edit-church-modal-title").text("Edit Church Details");
    $("#add-edit-church-modal").modal("show");
}

function saveChurch(){
    var name = $("#church-name").val();
    var address = $("#church-address").val();
    var description = $("#church-description").val();
    var error = "";
    if(name == "" || name == undefined){
        error = "*Name field should not be empty.";
    }else if(address == "" || address == undefined){
        error = "*Address field should not be empty";
    }else if(description == "" || description == undefined){
        error = "*Description field should not be empty.";
    }else{

        $.ajax({
            type: "POST",
            url: "save-church.php",
            dataType: 'html',
            data: {
                idx:churchIdx,
                name:name,
                address:address,
                description:description
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    $("#add-edit-church-modal").modal("hide");
                    getChurchList();
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            }
        });
    }

    $("#add-edit-church-modal-error").text(error);
}

function deleteChurch(idx){
    if(confirm("Are you sure you want to delete this Church?\n\n This Action cannot be undone!")){
        $.ajax({
            type: "POST",
            url: "delete-church.php",
            dataType: 'html',
            data: {
                idx:idx
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    getChurchList();
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