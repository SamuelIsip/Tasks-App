$(document).ready(() => {
  let edit = false;

  $("#tasks-result").hide();
  fetchTasks();

  $("#search").keyup(() => {
    if ($("#search").val()) {
      let search = $("#search").val();

      $.ajax({
        url: "task-search.php",
        type: "POST",
        data: { search },
        success: (response) => {
          let tasks = JSON.parse(response);
          let template = "";
          tasks.forEach((task) => {
            template += `<li>
            ${task.name}
          </li>`;
          });

          $("#container").html(template);
          $("#tasks-result").show();
        },
      });
    }
  });

  $("#task-form").submit((e) => {
    const postData = {
      name: $("#name").val(),
      description: $("#description").val(),
      id: $("#taskId2").val(),
    };

    let url = edit === false ? "task-add.php" : "task-edit.php";

    $.post(url, postData, (response) => {
      console.log(response);
      fetchTasks();
      $("#task-form").trigger("reset");
    });
    e.preventDefault();
  });

  function fetchTasks() {
    $.ajax({
      url: "task-list.php",
      type: "GET",
      success: (response) => {
        let tasks = JSON.parse(response);
        let template = "";
        tasks.forEach((task) => {
          template += `
                <tr taskId="${task.id}">
                    <td>${task.id}</td>
                    <td>
                        <a href="#" class="task-item">${task.name}</a>
                    </td>
                    <td>${task.description}</td>
                    <td>
                        <button class="task-delete btn btn-danger">Delete</button>
                    </td>
                </tr>
              `;
        });
        $("#tasks").html(template);
      },
    });
  }

  $(document).on("click", ".task-delete", function () {
    if (confirm("Are you sure you want to delete it?")) {
      let element = $(this)[0].parentElement.parentElement;
      let id = $(element).attr("taskId");

      $.post("task-delete.php", { id }, (response) => {
        console.log(response);
        fetchTasks();
      });
    }
  });

  $(document).on("click", ".task-item", function () {
    let element = $(this)[0].parentElement.parentElement;
    let id = $(element).attr("taskId");

    $.post("task-single.php", { id }, (response) => {
      let task = JSON.parse(response);
      $("#name").val(task.name);
      $("#description").val(task.description);
      $("#taskId2").val(task.id);
      edit = true;
    });
  });
});
