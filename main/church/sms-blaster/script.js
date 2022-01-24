$(document).ready(function(){
    setTimeout(function(){
        $("#sms-blaster-menu").attr("href","#");
        $("#sms-blaster-menu").addClass("active");
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

var contactIdx;
getProfileSettings();
getUserList();

function getProfileSettings(){
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
                renderProfileSettings(resp[1]);
            }else if(resp[0] == "false"){
                alert(resp[1]);
            } else{
                alert(response);
            }
        }
    });
}

function renderProfileSettings(data){
    var lists = JSON.parse(data);
    lists.forEach(function(list){
        if(list.image != ""){
            $("#profile-settings-picture").attr("src", list.image);
            $("#global-user-image").attr("src", list.image);
        }
        $("#profile-settings-name").val(list.name);
        $("#profile-settings-username").val(list.username);
        $("#global-user-name").text(list.name);
    })
}

function getUserList(){
    $.ajax({
		type: "POST",
		url: "get-user-list.php",
		dataType: 'html',
		data: {
			dummy:"dummy"
		},
		success: function(response){
			var resp = response.split("*_*");
			if(resp[0] == "true"){
				renderUserList(resp[1]);
			}else if(resp[0] == "false"){
				alert(resp[1]);
			} else{
				alert(response);
			}
		}
	});
}

function renderUserList(data){
    var lists = JSON.parse(data);
    var markUp = '<table id="user-list-table" class="table table-striped table-bordered table-sm">\
                        <thead>\
                            <tr>\
                                <th>Name</th>\
                                <th>Address</th>\
                                <th>Phone Number</th>\
                                <th style="max-width:30px;min-width:30px;">Action</th>\
                            </tr>\
                        </thead>\
                        <tbody>';
    markUp += '<tr>\
                <td>Send to all user</td>\
                <td></td>\
                <td></td>\
                <td>\
                    <button type="button" class="btn btn-success btn-sm" onclick="numberSelected(\'all\')"><i class="fa fa-plus"></i></button>\
                </td>\
               </tr>';
    lists.forEach(function(list){
        markUp += '<tr>\
                        <td>'+list.name+'</td>\
                        <td>'+list.address+'</td>\
                        <td>'+list.number+'</td>\
                        <td>\
                            <button type="button" class="btn btn-success btn-sm" onclick="numberSelected(\''+ list.number +'\')"><i class="fa fa-plus"></i></button>\
                        </td>\
                   </tr>';
    })
    markUp += '</tbody></table>';
    $("#user-list-table-container").html(markUp);
    $("#user-list-table").DataTable();
}


function showSelectNumber(){
    $("#select-user-modal").modal("show");
}

function numberSelected(number){
    $("#message-number").val(number);
    $("#select-user-modal").modal("hide");
}

function sendMessage(){
    var number = $("#message-number").val();
    var message = $("#message").val();
    var error = "";
    if(number == "" || number == undefined){
        error = "*Please select a number where the message is to be sent to.";
    }else if(message == "" || message == undefined){
        error = "*Message field should not be empty!";
    }else{
        $.ajax({
            type: "POST",
            url: "send-message.php",
            dataType: 'html',
            data: {
                number:number,
                message:message
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    alert(resp[1]);
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
                clearForm();
            }
        });
    }
    $("#send-message-error").text(error);
}

function clearForm(){
    $("#message-number").val("");
    $("#message").val("");
    $("#send-message-error").text("");
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