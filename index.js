const express = require("express");
const socket = require("socket.io");

const app = express();

app.use(express.static("public"));

const io = socket(
  app.listen(process.env.PORT || 8080, () =>
    console.log("Server running on 8080.........")
  )
);

var users = [];
io.on("connection", (socket) => {
  //console.log(users);
  var name;
  socket.on("target", (target) => {
    name = target;
    // console.log(name);
  });

  socket.on("msgToServer", (data, callback) => {
    var msg = data.msg.trim();
    if (msg) {
      if (name === undefined || name === " ") {
        io.sockets.emit("newMsg", { msg: msg, name: socket.nickname });
        //  console.log("i am in space", socket.nickname);
      } else {
        if (name !== socket.nickname) {
          //  console.log(name, socket.nickname);
          users[name].emit("newMsg", { msg: msg, name: socket.nickname });
          console.log(users[name].emit);

          users[socket.nickname].emit("newMsg", {
            msg: msg,
            name: socket.nickname,
          });
        } else {
          callback("Can't send to own ");
        }
      }
    } else {
      callback("Can't send empty msg");
    }
  });
  socket.on("newUser", (id, isValid) => {
    if (id) {
      if (id in users) {
        isValid({ valid: false });
      } else {
        isValid({ valid: true });
        socket.nickname = id;
        users[socket.nickname] = socket;
        updateIds();
      }
    } else {
      isValid({ valid: false, msg: "Enter UserName" });
    }
  });
  function updateIds() {
    io.sockets.emit("activeUsers", Object.keys(users));
  }
  socket.on("disconnect", () => {
    if (!socket.nickname) return;
    delete users[socket.nickname];
    updateIds();
  });
});
