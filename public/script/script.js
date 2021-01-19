const socket = io();

$("#message-form").submit(function (e) {
  e.preventDefault();
  var userMsg = $("#user-message").val();
  socket.emit(
    "msgToServer",
    {
      msg: userMsg,
    },
    (callback) => {
      $("#messages").append("<span id='error'>" + callback + " </span><br/>");
    }
  );
  $("#user-message").val("");
});

$("#register").submit(function (e) {
  e.preventDefault();
  var userName = $("#creatingUserName").val().replaceAll(" ", "");
  socket.emit("newUser", userName, (isValid) => {
    if (isValid.valid) {
      $("#userNameChooser").hide();
      $("#content").show();
    } else {
      $("#userNameEror").html(
        "Username already taken.... try again with different username.."
      );
      $("#userNameEror").html(isValid.msg);
    }
  });
  $("creatingUserName").val("");
});

socket.on("activeUsers", (ids, id) => {
  html = "";

  ids.forEach((e) => {
    if (socket.id !== id) html += `<li class="chat" id=${e}> ${e}</li> <br/>`;
  });
  $("#activeUsers").html(html);
  var target;
  var f = 0;
  $("#activeUsers").click(function (event) {
    if (event.target && event.target.nodeName == "LI") target = event.target.id;
    console.log(target);
    if (target === event.target.id && f === 1) {
      $("#" + target).css({ backgroundColor: "black", color: "white" });
      console.log("equal");
      f = 0;
      target = " ";
      socket.emit("target", target);
      target = event.target.id;
    } else {
      $("#" + target).css({ backgroundColor: "white", color: "black" });
      target = event.target.id;
      f = 1;
      socket.emit("target", target);
      target = " ";
    }
  });
});

socket.on("newMsg", (data) => {
  $("#messages").append(
    `${data.name}<li class="li"><i class="fas fa-user msgicon"></i>${
      data.msg
    }</li><li id='time'>${
      new Date().getHours().toLocaleString() +
      ":" +
      new Date().getMinutes().toLocaleString()
    }</li> <br/>`
  );
});
