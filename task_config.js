$(document).ready(function () {
  const $taskTable = $("#task-table");
  const $subTaskTable = $("#sub-task-table");
  const $addTaskBtn = $("#add-task-btn");
  const $addSubTaskBtn = $("#add-sub-task-btn");
  // const $configDialog = $("#config-dialog");
  // const $confirDelDialog = $("#del-reward-dialog");

  const $inputZhHans = $("#name-zh-hans");
  const $inputZhHant = $("#name-zh-hant");
  const $inputEn = $("#name-en");
  const $inputLogo = $("#logo");
  const $puzzleNum = $("#show-puzzle-count");
  const $startTimePicker = $("#startTime");
  const $endTimePicker = $("#endTime");

  const $taskBox = $("#taskBox");
  const $taskConfirmBtn = $("#task-confirm-button");
  const $addRuleBtn = $("#add-rule-button");
  const $statusSelect = $("#status-select");

  $startTimePicker.datepicker();
  $endTimePicker.datepicker();

  const inputArr = [
    {
      key: "zh-hans",
      dom: $inputZhHans,
    },
    {
      key: "zh-hant",
      dom: $inputZhHant,
    },
    {
      key: "en",
      dom: $inputEn,
    },
    {
      key: "icon_url",
      dom: $inputLogo,
    },
    {
      key: "start_time",
      dom: $startTimePicker,
    },
    {
      key: "end_time",
      dom: $endTimePicker,
    },
    {
      key: "show_puzzle_num",
      dom: $puzzleNum,
    },
  ];

  $addRuleBtn.on("click", function () {
    // 复制元素 并将input的值清空
    let cloneEle = $(".puzzle-rule:first").clone();
    cloneEle.find("input").each(function (i, d) {
      $(d).val("");
    });
    cloneEle.appendTo($(".rule-wrap"));

    // $(".puzzle-rule:first").clone().appendTo($(".rule-wrap"));
  });

  // const delBtn = $("#del-config-btn");
  // $configDialog.css("display", "none");
  // $confirDelDialog.css("display", "none");

  // 获取子任务列表id
  function renderSubTask() {
    const mock_data = ["1", "2", "3"];
    mock_data.forEach((d) => {
      $taskBox.append(`
        <div class='task-box-item'>
          <label>${d}</label>
          <input type='checkbox'value=${d} class='task-checkbox'/>
        </div>
        
      `);
    });
  }

  renderSubTask();

  // 编辑奖励事件
  window.editTaskEvent = {
    "click .edit-btn": function (e, value, row, index) {
      const jsonParseName = JSON.parse(row.name);
      //复现
      inputArr.forEach((d) => {
        if (["zh-hans", "zh-hant", "en"].indexOf(d.key) > -1) {
          d.dom.val(jsonParseName[d.key]);
        } else {
          d.dom.val(row[d.key]);
        }
      });
      $statusSelect.val(row.status);
      $configDialog.dialog({
        minWidth: "800",
      });
    },
  };

  // 删除奖励
  window.delTaskEvent = {
    "click .del-btn": function (e, value, row, index) {
      $confirDelDialog.dialog({
        minWidth: "300",
      });

      // 删除奖励
      // /taskcenter/del_reward
      delBtn.on("click", function () {
        toastr.options = toastrOptions;
        toastr.success("删除成功");
        $rewardConfigTable.bootstrapTable("refresh");
      });
    },
  };

  // 任务列表
  $taskTable.bootstrapTable({
    method: "get",
    url: "./task.mock.json", // 请求路径
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
        title: "任务期数",
        field: "name",
        formatter: function (value) {
          const parseName = JSON.parse(value);
          return parseName["zh-hans"];
        },
      },
      {
        title: "开始时间",
        field: "start_time",
      },
      {
        title: "结束时间",
        field: "end_time",
      },
      {
        title: "成就logo",
        field: "achievement_url",
        formatter: function (value) {
          return [`<img src=${value} style='width: 30px;height:30px;'></img>`];
        },
      },
      {
        title: "状态",
        field: "status",
        formatter: function (value) {
          return value === 1 ? "开启" : "关闭";
        },
      },
      {
        title: "编辑",
        events: editTaskEvent,
        formatter: function () {
          return ["<button class='edit-btn'>编辑</button>"];
        },
      },
      {
        title: "删除",
        events: delTaskEvent,
        formatter: function () {
          return ["<button class='edit-btn'>删除</button>"];
        },
      },
    ],
  });

  function confirmTask(type) {
    const params = {};
    // 规则
    const rules = [];
    const mapKeys = ["upper", "lower", "participant_percentage"];
    const ruleDoms = $(".puzzle-rule");
    ruleDoms.each(function (i, d) {
      let obj = {};
      const inputs = $(d).find("input");
      inputs.each(function (ii, dd) {
        obj[mapKeys[ii]] = $(dd).val();
      });
      rules.push(obj);
    });
    try {
      rules.forEach(function (d, i) {
        if (!d.upper || !d.lower || !d.participant_percentage) {
          throw new Error("不能存在为空值的规则");
        }
      });
    } catch (e) {
      alert(e);
      return;
    }
    const totalPartiPercent = rules.reduce(function (prev, curr) {
      console.log("xx", curr.participant_percentage);
      prev += Number(curr.participant_percentage) || 0;
      return prev;
    }, 0);
    if (Number(totalPartiPercent) !== 1) {
      alert("每个任务定义规则的人数占比相加必须等于1");
    }
    params.rules = JSON.stringify({ rules });
    // 选中 sub task ID
    const subtask_id_list = [];
    const checkboxArr = $(".task-checkbox");
    checkboxArr.each(function (i, d) {
      if ($(d).is(":checked")) {
        subtask_id_list.push($(d).val());
      }
    });
    if (subtask_id_list.length === 0) {
      alert("请选择关联子任务ID");
    }
    params.subtask_id_list = subtask_id_list;
    // 状态
    params.status = Number($statusSelect.val());
    console.log("$statusSelect.val()", $statusSelect.val());

    const name = {};
    // 其他input
    inputArr.forEach((d) => {
      if (["zh-hans", "zh-hant", "en"].indexOf(d.key) > -1) {
        name[d.key] = d.dom.val();
      } else {
        params[d.key] = d.dom.val();
      }
    });
    params.name = name;

    console.log("[[params]]", params);
  }

  $taskConfirmBtn.on("click", function () {
    confirmTask("create");
  });
  // 子任务列表
  $subTaskTable.bootstrapTable({
    method: "get",
    url: "./sub.task.mock.json", // 请求路径
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
        title: "任务序号",
        field: "subtask_id",
      },
      {
        title: "任务名称",
        field: "name",
        formatter: function (value) {
          const parseName = JSON.parse(value);
          return parseName["zh-hans"];
        },
      },
      {
        title: "奖励积分",
        field: "points",
      },
    ],
  });
});
