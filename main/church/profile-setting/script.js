var updateProfileSettingsFlag = false;
var profileSettingsIdx;
var baseUrl = $("#base-url").text();

$(document).ready(function(){
    getProfileSettings();
})

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

function saveProfileSettings(){
    userImage = $("#profile-settings-picture").attr("src");
    userName = $("#profile-settings-name").val();
    userUsername = $("#profile-settings-username").val();

    var error;
    if(userName == "" || userName == undefined){
        error = "*Name field should not be empty.";
    }else if(userUsername == "" || userUsername == undefined){
        error = "*Username field should not be empty.";
    }else{
        $.ajax({
            type: "POST",
            url: "save-profile-settings.php",
            dataType: 'html',
            data: {
                image: userImage,
                name: userName,
                username: userUsername
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    alert(resp[1]);
                    getProfileSettings();
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            }
        });
    }
}

function profileChangePassword(){
    $("#change-password-modal").modal("show");
}

function clearChangePasswordModal(){
    $("#profile-setting-old-password").val("");
    $("#profile-setting-new-password").val("");
    $("#profile-setting-retype-password").val("");
}

function savePassword(){
    var error = "";
    var oldPassword = $("#profile-setting-old-password").val();
    var newPassword = $("#profile-setting-new-password").val();
    var retypePassword = $("#profile-setting-retype-password").val();

    if(oldPassword == "" || oldPassword == undefined){
        error = "*Old Password field should not be empty!";
    }else if(newPassword == "" || newPassword == undefined){
        error = "*New Password field should not be empty!";
    }else if(retypePassword == "" || retypePassword == undefined){
        error = "*Retype Password field should not be empty!";
    }else if(newPassword != retypePassword){
        error = "*New Password and Retype Password does not match, Please check!";
    }else{
        error = "";
        $.ajax({
            type: "POST",
            url: "change-password.php",
            dataType: 'html',
            data: {
                idx:profileSettingsIdx,
                old: oldPassword,
                new: newPassword,
                retype: retypePassword
            },
            success: function(response){
                clearChangePasswordModal();
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    alert(resp[1]);
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            }
        });
    }

    $("#change-password-modal-error").text(error);
}

var profileImage;
var loadProfileImage= function(event){
	var reader = new FileReader();
	reader.onload = function(e) {
		$('#profile-image-editor-buffer').attr('src', e.target.result);

        if(profileImage){
            profileImage.destroy();
        }

		profileImage = new Croppie($('#profile-image-editor-buffer')[0], {
			viewport: { width: 300, height: 300,type:'circle'},
			boundary: { width: 400, height: 400 },
            enableOrientation: true
		});

        $('#profile-image-editor-modal').modal('show');
		$('#profile-image-editor-ok-btn').on('click', function() {
			profileImage.result('base64').then(function(dataImg) {
				var data = [{ image: dataImg }, { name: 'myimage.jpg' }];
				$('#profile-settings-picture').attr('src', dataImg);
			});
		});
	}
	reader.readAsDataURL(event.target.files[0]);
}

function profileImageEditorCancel(){
	if(profileImage){
		profileImage.destroy();
    }
}

function profileImageEditorRotate(){
	profileImage.rotate(-90);
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