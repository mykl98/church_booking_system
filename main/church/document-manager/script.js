$(document).ready(function() {
    getUserDetails();
    getDocumentList("all");
    getDepartmentList();

    setTimeout(function(){
        $("#document-manager-menu").attr("href","#");
        $("#document-manager-menu").addClass("active");
    },100)
});

var baseUrl = $("#base-url").text();
var fileUploadTriggeredFlag = false;
var manageDocumentIdx;

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

function getDocumentList(department){
    $.ajax({
        type: "POST",
        url: "get-document-list.php",
        dataType: 'html',
        data: {
            department:department
        },
        success: function(response){
            var resp = response.split("*_*");
            if(resp[0] == "true"){
                renderDocumentList(resp[1]);
            }else if(resp[0] == "false"){
                alert(resp[1]);
            } else{
                alert(response);
            }
        }
    });
}

function renderDocumentList(data){
    var lists = JSON.parse(data);
    var markUp = '<table id="document-manager-table" class="table table-striped table-bordered">\
                        <thead>\
                            <tr>\
                                <th>ID</th>\
                                <th>Date</th>\
                                <th>Description</th>\
                                <th>Category</th>\
                                <th>Visibility</th>\
                                <th>Status</th>\
                                <th style="width:90px;"></th>\
                            </tr>\
                        </thead>\
                        <tbody>';
    lists.forEach(function(list){
        var link = list.link;
        link = link.split("../../..");
        link = baseUrl + link[1];
        markUp += '<tr>\
                        <td>'+list.documentid+'</td>\
                        <td>'+list.documentdate+'</td>\
                        <td>'+list.description+'</td>\
                        <td>'+list.category+'</td>\
                        <td>'+list.visibility+'</td>\
                        <td>'+list.status+'</td>\
                        <td>\
                            <a class="btn btn-primary btn-sm" href="'+link+'" target="_blank"><i class="fa fa-eye text-white"></i></a>\
                            <button class="btn btn-success btn-sm" onclick="editDocument(\''+ list.idx +'\')"><i class="fa fa-pencil"></i></button>\
                            <button class="btn btn-danger btn-sm" onclick="deleteDocument(\''+ list.idx +'\')"><i class="fas fa-trash"></i></button>\
                        </td>\
                   </tr>';
    })
    markUp += '</tbody></table>';
    $("#document-manager-table-container").html(markUp);
    $("#document-manager-table").DataTable();
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
    var markUp = '<select id="document-department-select" class="float-right btn btn-sm bg-success text-white mr-1" onchange="departmentChange()">\
                        <option class="text-left" value="all">All Department</option>';
    lists.forEach(function(list){
        markUp += '<option class="text-left" value='+list.idx+'>'+list.name+'</option>';
    })
    markUp += '</select>';
    $("#department-select-container").html(markUp);
}

function manageDocumentToggle(type){
    if(type == "link"){
        $("#document-upload-link").hide();
        $("#document-upload-file").show();
        fileUploadTriggered();
    }else{
        $("#document-upload-link").show();
        $("#document-upload-file").hide();
    }
}

function departmentChange(){
    var department = $("#document-department-select").val();
    getDocumentList(department);
}

$(document).on('shown.lte.pushmenu', function(){
    $("#global-department-name").show();
    $("#global-client-logo").attr("width","100px");
})

$(document).on('collapsed.lte.pushmenu', function(){
    $("#global-department-name").hide();
    $("#global-client-logo").attr("width","40px");
})

/*============== Toggle Dropdown ==================*/
function toggle_menu(ele) {
    //close all ul with children class that are open except the one with the selected id
    $( '.children' ).not( document.getElementById(ele) ).slideUp("Normal");
    $( "#"+ele ).slideToggle("Normal");
    localStorage.setItem('lastTab', ele);
}

function editDocument(idx){
    manageDocumentIdx = idx;
    $.ajax({
		type: "POST",
		url: "get-document-detail.php",
		dataType: 'html',
		data: {
			idx:manageDocumentIdx
		},
		success: function(response){
			var resp = response.split("*_*");
			if(resp[0] == "true"){
				renderEditDocument(resp[1]);
			}else if(resp[0] == "false"){
				alert(resp[1]);
			} else{
				alert(response);
			}
		}
	});
}

function renderEditDocument(data){
    var lists = JSON.parse(data);

    lists.forEach(function(list){
        renderCategories(list.categories,function(){
            $("#document-id").val(list.documentid);
            $("#document-date").val(list.documentdate);
            $("#document-upload-date").val(list.uploaddate);
            $("#document-department").val(list.department);
            $("#document-description").val(list.description);
            $("#document-category").val(list.category);
            $("#document-visibility").val(list.visibility);
            $("#document-status").val(list.status);
            $("#document-upload-link").val(list.link);
            if(list.link == "" || list.link == undefined){
                $("#document-upload-link").hide();
                $("#document-upload-file").show();
            }else{
                $("#document-upload-link").show();
                $("#document-upload-file").hide();
            }
        })
    })
    $("#add-edit-document-modal").modal("show");
    $("#add-edit-document-modal-title").text("Edit Document");
}

function renderCategories(data,callback){
    var lists = JSON.parse(data);
    var markUp =    '<div class="form-group">\
                        <label for="document-category" class="col-form-label">Category:</label>\
                            <select class="form-control" id="document-category">';
    lists.forEach(function(list){
        markUp += '<option value='+list.idx+'>'+list.name+'</option>';
    })
    markUp += '</select></div>';
    $("#document-category-container").html(markUp);
    callback();
}

function saveDocument(){
    var selectedDepartment = $("#document-department-select").val();
    var documentId = $("#document-id").val();
    var documentDate = $("#document-date").val();
    var uploadDate = $("#document-upload-date").val();
    var description = $("#document-description").val();
    var category = $("#document-category").val();
    var visibility = $("#document-visibility").val();
    var status = $("#document-status").val();
    var link;
    var error;

    if(documentId == "" || documentId == undefined){
        error = "*Document ID field should not be blank";
    }else if(documentDate == "" || documentDate == undefined){
        error = "*Document Date field should not be blank";
    }else if(uploadDate == "" || uploadDate == undefined){
        error = "*Upload Date field should not be blank";
    }else if(description == "" || description == undefined){
        error = "*Description field should not be blank";
    }else if(category == "" || category == undefined){
        error = "*Please select category.";
    }else if(visibility == "" || visibility == undefined){
        error = "*Please select visibility type";
    }else{
        if(fileUploadTriggeredFlag == true){
            fileUploadTriggeredFlag = false;
            var file = $("#document-upload-file").val()
            if(file == "" || file == undefined){
                error = "*Please provide file to upload";
            }else{
                uploadDocument(function(){
                    link = $("#document-upload-link").val();
                    $.ajax({
                        type: "POST",
                        url: "save-document.php",
                        dataType: 'html',
                        data: {
                            idx:manageDocumentIdx,
                            documentid:documentId,
                            documentdate:documentDate,
                            uploaddate:uploadDate,
                            description:description,
                            category:category,
                            visibility:visibility,
                            link:link,
                            status:status
                        },
                        success: function(response){
                            var resp = response.split("*_*");
                            if(resp[0] == "true"){
                                getDocumentList(selectedDepartment);
                                $("#add-edit-document-modal").modal("hide");
                                clearAddEditDocumentModal();
                            }else if(resp[0] == "false"){
                                alert(resp[1]);
                            } else{
                                alert(response);
                            }
                        }
                    });
                })
            }
        }else{
            link = $("#document-upload-link").val()
            $.ajax({
                type: "POST",
                url: "save-document.php",
                dataType: 'html',
                data: {
                    idx:manageDocumentIdx,
                    documentid:documentId,
                    documentdate:documentDate,
                    uploaddate:uploadDate,
                    description:description,
                    category:category,
                    visibility:visibility,
                    link:link,
                    status:status
                },
                success: function(response){
                    var resp = response.split("*_*");
                    if(resp[0] == "true"){
                        getDocumentList(selectedDepartment);
                        $("#add-edit-document-modal").modal("hide");
                        clearAddEditDocumentModal();
                    }else if(resp[0] == "false"){
                        alert(resp[1]);
                    } else{
                        alert(response);
                    }
                }
            });
        }
    }
    $("#save-document-error").text(error);
}

function clearAddEditDocumentModal(){
    $("#document-id").val("");
    $("#document-date").val("");
    $("#document-upload-date").val("");
    $("#document-description").val("");
    $("#document-category").val("");
    $("#document-visibility").val("private");
    $("#document-status").val("active");
    $("#document-upload-link").hide();
    $("#document-upload-file").hide();
    $("#save-document-error").text("");
}

function deleteDocument(idx){
    var selectedCategory = $("#manage-document-category-select").val();
    if(confirm("Are you sure you want to delete this document?\nThis action cannot be undone.")){
        $.ajax({
            type: "POST",
            url: "delete-document.php",
            dataType: 'html',
            data: {
                idx:idx
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    getDocumentList("1", selectedCategory);
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            }
        });
    }
}

$("#uploading-modal").on("show.bs.modal", function(){
    $("#add-edit-document-modal").modal("hide");
})

function fileUploadTriggered(){
    fileUploadTriggeredFlag = true;
}

function uploadDocument(callback){
    var formData = new FormData();
    formData.set('file',$("#document-upload-file")[0].files[0]);
    formData.set('idx',manageDocumentIdx);
    $("#uploading-modal").modal("show");
    setTimeout(function(){
        $.ajax({
            url : 'upload-file.php',
            type : 'POST',
            data : formData,
            processData: false,  // tell jQuery not to process the data
            contentType: false,  // tell jQuery not to set contentType
            success : function(response) {
                $("#uploading-modal").modal("hide");
                $("#document-upload-file").val("");
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    $("#document-upload-link").val(resp[1]);
                    $("#document-upload-link").show();
                    $("#document-upload-file").hide();
                    callback();
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            },
            failure: function(error){
                $("#uploading-modal").modal("hide");
            }
        });
    },1000)
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
                window.open("../../../index.php","_self")
            }else if(resp[0] == "false"){
                alert(resp[1]);
            } else{
                alert(response);
            }
        }
    });
}
