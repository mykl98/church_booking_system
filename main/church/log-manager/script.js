$(document).ready(function() {
    getUserDetails();
    getLogList("all","");

    setTimeout(function(){
        $("#log-manager-menu").attr("href","#");
        $("#log-manager-menu").addClass("active");
    },100)
});

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

function getLogList(from,to){
    $.ajax({
        type: "POST",
        url: "get-log-list.php",
        dataType: 'html',
        data: {
            from:from,
            to:to
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
    var markUp = '<table id="log-manager-table" class="table table-striped table-bordered">\
                        <thead>\
                            <tr>\
                                <th>Date</th>\
                                <th>Time</th>\
                                <th>Log Details</th>\
                                <th>Department</th>\
                                <th>Account</th>\
                                <th>Action</th>\
                            </tr>\
                        </thead>\
                        <tbody>';
    lists.forEach(function(list){
        markUp += '<tr>\
                        <td>'+list.date+'</td>\
                        <td>'+list.time+'</td>\
                        <td>'+list.log+'</td>\
                        <td>'+list.department+'</td>\
                        <td>'+list.account+'</td>\
                        <td>\
                            <button class="btn btn-danger btn-sm" onclick="deleteLog(\''+ list.idx +'\')"><i class="fas fa-trash"></i></button>\
                        </td>\
                   </tr>';
    })
    markUp += '</tbody></table>';
    $("#log-manager-table-container").html(markUp);
    $("#log-manager-table").DataTable();
}

function clearLog(){
    if(confirm("Are you sure you want to clear the entire system logs?\nThis action cannot be undone.")){
        $.ajax({
            type: "POST",
            url: "clear-log.php",
            dataType: 'html',
            data: {
                dummy:"dummy"
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    getLogList("all","");
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            }
        });
    }
}

function deleteLog(idx){
    if(confirm("Are you sure you want to delete this log entry?\nThis action cannot be undone.")){
        $.ajax({
            type: "POST",
            url: "delete-log.php",
            dataType: 'html',
            data: {
                idx:idx
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    getLogList("all","");
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            }
        });
    }
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
