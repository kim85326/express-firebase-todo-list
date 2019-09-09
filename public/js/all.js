var sendButton = document.getElementById("sendButton");
var contentInput = document.getElementById("contentInput");
var todosDom = document.getElementById("todos");

sendButton.addEventListener("click", function() {
    var content = contentInput.value;

    var xhr = new XMLHttpRequest();
    xhr.open("post", "/addTodo");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status <= 400) {
            var response = JSON.parse(xhr.responseText);
            alert(response.message);
            updateTodos(response.todos);
            contentInput.value = "";
        } else {
            alert("error");
        }
    };
    var todo = { content: content };
    xhr.send(JSON.stringify(todo));
});

todosDom.addEventListener("click", function(event) {
    if (event.target.classList.contains("removeButton")) {
        var xhr = new XMLHttpRequest();
        xhr.open("post", "/removeTodo");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 400) {
                var response = JSON.parse(xhr.responseText);
                alert(response.message);
                updateTodos(response.todos);
            } else {
                alert("error");
            }
        };
        var id = event.target.dataset.id;
        var content = { id: id };
        xhr.send(JSON.stringify(content));
    }
});

function updateTodos(newTodos) {
    var str = "";

    for (var key in newTodos) {
        str += `
            <li>
                ${newTodos[key].content}
                <input
                    type="button"
                    class="removeButton"
                    value="刪除"
                    data-id="${key}"
                />
            </li>
        `;
    }

    todosDom.innerHTML = str;
}
