$(document).ready(function () {
  const $userIdInput = $("#userIdInput");
  const $addressInput = $("#addressInput");
  const $searchBtn = $("#searchBtn");
  const $table = $("#user-table");
  const $userCount = $("#ob-user-count");
  const $taskDialog = $("#task-dialog");
  const $taskItem = $("#task-item");
  const $taskTable = $("#task-table");
  const $rewardDialog = $("#reward-dialog");
  const $rewardTable = $("#reward-table");

  let ACIVE_TASK_ID = 0;

  $userIdInput.attr("placeholder", "请输入uid");
  $addressInput.attr("placeholder", "请输入钱包地址");

  const toastrOptions = {
    closeButton: true,
    debug: false,
    progressBar: false,
    positionClass: "toast-top-center",
    onclick: null,
    showDuration: "400",
    hideDuration: "1000",
    timeOut: "3000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
  };

  // 格式化任务名
  function formatterNameJson(val) {
    return JSON.parse(val)["zh-hans"];
  }

  // // 获取总的注册人数
  // async function getObPassTotal() {
  //   // /taskcenter/get_pass
  //   // POST
  //   // {event_id: uuid()}
  //   $userCount.html("32131");
  // }

  // getObPassTotal();

  // 渲染任务完成table
  function renderTaskDoneTable() {
    $taskTable.bootstrapTable({
      method: "get",
      url: "./mock_json.json", // 请求路径
      striped: true, // 是否显示行间隔色
      pageNumber: 1, // 初始化加载第一页
      pagination: true, // 是否分页
      sidePagination: "client", // server:服务器端分页|client：前端分页
      pageSize: 5, // 单页记录数
      pageList: [5, 20, 30],
      // showRefresh : true,// 刷新按钮
      queryParams: function (params) {
        // console.log("[[params]]", params);
        // 上传服务器的参数
        // const query = {
        //   event_id: "231",
        // };
        // var temp = {
        //   name: $("#sname").val(),
        //   viewReason: $("#viewReason").val(),
        // };
        // return temp;
      },
      columns: [
        {
          title: "任务ID",
          field: "subtask_id",
        },
        {
          title: "任务名称",
          field: "name",
          formatter: formatterNameJson,
        },
        {
          title: "是否完成",
          field: "is_done",
          formatter: function (val) {
            return val == 0 ? "否" : "是";
          },
        },
        {
          title: "验证完成事件",
          field: "done_time",
          formatter: function (val) {
            return "2312";
          },
        },
      ],
    });
  }

  function handleSearch() {
    if (!$emailInput.val() && !$phoneInput.val()) {
      toastr.options = toastrOptions;
      toastr.error("请输入有效的查询条件");
    }
    $table.bootstrapTable("refresh");
  }

  $searchBtn.on("click", handleSearch);

  // 查看任务完成情况按钮
  function viewTaskFunc() {
    return ["<button class='view-btn' id='task-view-btn'>查看</button>"];
  }

  function rewardFunc() {
    return ["<button class='reward-btn' id='reward-btn'>查看</button>"];
  }

  // 获取任务完成数据
  async function getTaskDoneData() {
    // 默认第一个
    // /taskcenter/get_tasks
    const data = [
      {
        task_id: 1,
        name: '{"zh-hans":"第一期","zh-hant":"第一期","en":"Phase1"}',
        start_time: "123",
        end_time: "456",
        status: 1,
      },
      {
        task_id: 2,
        name: '{"zh-hans":"第二期","zh-hant":"第一期","en":"Phase1"}',
        start_time: "123",
        end_time: "456",
        status: 1,
      },
    ];
    ACIVE_TASK_ID = data[0].task_id;

    data.forEach((d, i) => {
      const item = JSON.parse(d.name);
      $taskItem.append(`
        <span
          class="task-item ${i == ACIVE_TASK_ID - 1 ? "active-task-item" : ""}"
          task_id=${d.task_id}
          > ${item["zh-hans"]}<span>`);
    });

    $(".task-item").on("click", function () {
      const currTaskId = $(this).attr("task_id");
      console.log("currTaskId", currTaskId);
      if (ACIVE_TASK_ID != currTaskId) {
        $(".task-item").removeClass("active-task-item");
        ACIVE_TASK_ID = currTaskId;
        $(`.task-item[task_id=${currTaskId}]`).addClass("active-task-item");
        // 获取用户完成情况
        $taskTable.bootstrapTable("refresh");
      }
    });

    renderTaskDoneTable();
  }

  // 获取奖励数据
  async function getRewardData() {
    // get_user_rewards
    $rewardTable.bootstrapTable({
      method: "get",
      url: "./mock_json.json", // 请求路径
      striped: true, // 是否显示行间隔色
      pageNumber: 1, // 初始化加载第一页
      pagination: true, // 是否分页
      sidePagination: "client", // server:服务器端分页|client：前端分页
      pageSize: 5, // 单页记录数
      pageList: [5, 20, 30],
      // showRefresh : true,// 刷新按钮
      queryParams: function (params) {
        // console.log("[[params]]", params);
        // 上传服务器的参数
        // const query = {
        //   event_id: "231",
        // };
        // var temp = {
        //   name: $("#sname").val(),
        //   viewReason: $("#viewReason").val(),
        // };
        // return temp;
      },
      columns: [
        {
          title: "奖励ID",
          field: "reward_id",
        },
        {
          title: "奖励内容",
          field: "name",
          formatter: formatterNameJson,
        },
        {
          title: "领取时间",
          field: "claime_time",
        },
        {
          title: "发放时间 ",
          field: "send_time",
        },
      ],
    });

    // $(".task-item").on("click", function () {
    //   const currTaskId = $(this).attr("task_id");
    //   console.log("currTaskId", currTaskId);
    //   if (ACIVE_TASK_ID != currTaskId) {
    //     $(".task-item").removeClass("active-task-item");
    //     ACIVE_TASK_ID = currTaskId;
    //     $(`.task-item[task_id=${currTaskId}]`).addClass("active-task-item");
    //     // 获取用户完成情况
    //     $taskTable.bootstrapTable("refresh");
    //   }
    // });

    // renderTaskDoneTable();
  }

  // 任务
  window.taskViewEvent = {
    "click #task-view-btn": function (e, value, row, index) {
      getTaskDoneData();
      $taskDialog.dialog({
        // dialogClass: "no-close",
        minWidth: "800",
      });
    },
  };

  // 奖励
  window.rewardEvent = {
    "click #reward-btn": function () {
      getRewardData();
      $rewardDialog.dialog({
        // dialogClass: "no-close",
        minWidth: "800",
      });
    },
  };

  $table.bootstrapTable({
    method: "get",
    url: "./mock_json.json", // 请求路径
    striped: true, // 是否显示行间隔色
    pageNumber: 1, // 初始化加载第一页
    pagination: true, // 是否分页
    sidePagination: "client", // server:服务器端分页|client：前端分页
    pageSize: 5, // 单页记录数
    pageList: [5, 20, 30],
    // showRefresh : true,// 刷新按钮
    queryParams: function (params) {
      console.log("[[params]]", params);
      // 上传服务器的参数
      const query = {
        event_id: "231",
      };
      var temp = {
        name: $("#sname").val(),
        viewReason: $("#viewReason").val(),
      };
      return temp;
    },
    columns: [
      {
        title: "PassId",
        field: "pass_id",
      },
      {
        title: "账户邮箱",
        field: "name",
        formatter: formatterNameJson,
      },
      {
        title: "address",
        field: "address",
      },
      {
        title: "任务完成情况",
        events: taskViewEvent,
        formatter: viewTaskFunc,
      },
      {
        title: "奖励领取情况",
        events: rewardEvent,
        formatter: rewardFunc,
      },
      {
        title: "持有拼图数",
        field: "puzzle",
      },
      {
        title: "总积分",
        field: "points",
      },
    ],
  });
});
