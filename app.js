var express = require("express");
var bodyParser = require("body-parser");
var engine = require("ejs-locals");
var admin = require("firebase-admin");
var serviceAccount = require("./node-test-156c2-firebase-adminsdk-gqc8x-bc8aa1e574.json");

var app = express();

// view 模板
app.engine("ejs", engine);
app.set("views", "./views");
app.set("view engine", "ejs");

// 靜態檔案路徑
app.use(express.static("public"));

// 解析 body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://node-test-156c2.firebaseio.com"
});

var fireData = admin.database();

// 路由
// 顯示
app.get("/", function(req, res) {
    fireData.ref("todos").once("value", function(snapshot) {
        var data = snapshot.val();
        res.render("index", { todos: data });
    });
});

// 新增
app.post("/addTodo", function(req, res) {
    var content = req.body.content;
    var todosRef = fireData.ref("todos");
    todosRef.push({ content: content }).then(function() {
        todosRef.once("value", function(snapshot) {
            res.send({
                todos: snapshot.val(),
                message: "新增成功"
            });
        });
    });
});

// 刪除
app.post("/removeTodo", function(req, res) {
    var id = req.body.id;
    var todosRef = fireData.ref("todos");
    todosRef
        .child(id)
        .remove()
        .then(function() {
            todosRef.once("value", function(snapshot) {
                res.send({
                    todos: snapshot.val(),
                    message: "刪除成功"
                });
            });
        });
});

// 監聽
app.listen(3000, function() {
    console.log("http://localhost:3000");
});
