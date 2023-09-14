$(document).ready(function () {
  const $taskTable = $("#task-table");
  const $addTaskBtn = $("#add-task-btn");
  const $confirmTaskDelDialog = $("#del-task-dialog");
  const $taskDialog = $("#task-dialog");
  const $delTaskBtn = $("#del-task-btn");
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

  let TASK_ID = "";

  $startTimePicker.datepicker();
  $endTimePicker.datepicker();

  $confirmTaskDelDialog.css("display", "none");
  $taskDialog.css("display", "none");

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
      key: "achievement_url",
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

  const SUB_TASK_LIST = [
    {
      subtask_id: 1,
      name: '{"zh-hans":"备份MPC单元","zh-hant":"備份MPC單元","en":"BackupMPCUnit"}',
      desc: ' {"zh-hans":"备份MPC单元...","zh-hant":"備份MPC單元...","en":"BackupMPCUnit..."}',
      type: 1,
      status: 1,
      verification_count: 100,
      completed_count: 50,
      points: 100,
      jump_url: "http://abc.com",
      key: "backup_mpc",
    },
    {
      subtask_id: 1,
      name: '{"zh-hans":"备份MPC单元","zh-hant":"備份MPC單元","en":"BackupMPCUnit"}',
      desc: ' {"zh-hans":"备份MPC单元...","zh-hant":"備份MPC單元...","en":"BackupMPCUnit..."}',
      type: 1,
      status: 1,
      verification_count: 100,
      completed_count: 50,
      points: 100,
      jump_url: "http://abc.com",
      key: "backup_mpc",
    },
  ];

  function addTaskRuleItem() {
    // 复制元素 并将input的值清空
    let cloneEle = $(".puzzle-rule:first").clone();
    cloneEle.find("input").each(function (i, d) {
      $(d).val("");
    });
    cloneEle.appendTo($(".rule-wrap"));
  }

  $addRuleBtn.on("click", function () {
    addTaskRuleItem();
  });

  $addTaskBtn.on("click", function () {
    TASK_ID = "";
    // 清空input
    inputArr.forEach((d) => {
      d.dom.val("");
    });
    // 状态
    $statusSelect.val(1);
    // checkboxs
    const checkboxs = $(".task-checkbox");
    checkboxs.each(function (i, d) {
      $(d).attr("checked", false);
    });
    // 规则
    const ruleDoms = $(".puzzle-rule");
    if (ruleDoms?.length > 1) {
      for (let i = 0; i < ruleDoms.length; i++) {
        if (i > 0) {
          $(ruleDoms[i]).remove();
        }
      }
    }
    ruleDoms.each(function (i, d) {
      const inputs = $(d).find("input");
      inputs.each(function (ii, dd) {
        $(dd).val("");
      });
    });
    $taskDialog.dialog({
      minWidth: "800",
    });
  });

  // 获取子任务列表
  function renderSubTask() {
    // /taskcenter/get_subtasks
    SUB_TASK_LIST.forEach((d) => {
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
      // 回显
      inputArr.forEach((d) => {
        if (d.key !== "start_time" && d.key !== "end_time") {
          if (["zh-hans", "zh-hant", "en"].indexOf(d.key) > -1) {
            d.dom.val(jsonParseName[d.key]);
          } else {
            d.dom.val(row[d.key]);
          }
        }
      });
      // 状态
      $statusSelect.val(row.status);
      // 规则
      if (row?.puzzle_rule) {
        const rules = JSON.parse(row.puzzle_rule).rules;
        const currLen = $(".puzzle-rule").length;
        if (currLen < rules.length) {
          let gap = rules.length - currLen;
          for (let i = 0; i < gap; i++) {
            addTaskRuleItem();
          }
        }
        const mapKeys = ["upper", "lower", "participant_percentage"];
        const ruleDoms = $(".puzzle-rule");
        ruleDoms.each(function (i, d) {
          const inputs = $(d).find("input");
          inputs.each(function (ii, dd) {
            $(dd).val(rules[i][mapKeys[ii]]);
          });
        });
      }
      // 时间
      $startTimePicker.datepicker("setDate", row.start_time);
      $endTimePicker.datepicker("setDate", row.end_time);
      // chcekbox 子任务
      const checkboxs = $(".task-checkbox");
      if (row.subtask_id_list?.length > 0) {
        for (let i = 0; i < row.subtask_id_list.length; i++) {
          for (let j = 0; j < checkboxs.length; j++) {
            if (row.subtask_id_list[i] == $(checkboxs[j]).val()) {
              $(checkboxs[j]).attr("checked", true);
            }
          }
        }
      }
      TASK_ID = row.task_id;
      $taskDialog.dialog({
        minWidth: "800",
      });
    },
  };

  // 删除任务奖励
  window.delTaskEvent = {
    "click .del-task-btn": function (e, value, row, index) {
      $confirmTaskDelDialog.dialog({
        minWidth: "300",
      });
      // /taskcenter/del_task
      $delTaskBtn.on("click", function () {
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
          return ["<button class='del-task-btn'>删除</button>"];
        },
      },
    ],
  });

  // 新建任务/编辑任务
  function confirmTask() {
    const params = {};
    if (TASK_ID) {
      params.task_id = TASK_ID;
    }
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

  // 提交任务配置方法
  $taskConfirmBtn.on("click", function () {
    confirmTask();
  });

  // ========================
  // 子任务列表

  const $subTaskTable = $("#sub-task-table");
  const $addSubTaskBtn = $("#add-sub-task-btn");

  window.editSubTaskEvent = {
    "click .edit-btn": function (e, value, row, index) {
      const jsonParseName = JSON.parse(row.name);
      // 回显
      // inputArr.forEach((d) => {
      //   if (d.key !== "start_time" && d.key !== "end_time") {
      //     if (["zh-hans", "zh-hant", "en"].indexOf(d.key) > -1) {
      //       d.dom.val(jsonParseName[d.key]);
      //     } else {
      //       d.dom.val(row[d.key]);
      //     }
      //   }
      // });
      // 状态
      // $statusSelect.val(row.status);
      // 规则
      // if (row?.puzzle_rule) {
      //   const rules = JSON.parse(row.puzzle_rule).rules;
      //   const currLen = $(".puzzle-rule").length;
      //   if (currLen < rules.length) {
      //     let gap = rules.length - currLen;
      //     for (let i = 0; i < gap; i++) {
      //       addTaskRuleItem();
      //     }
      //   }
      //   const mapKeys = ["upper", "lower", "participant_percentage"];
      //   const ruleDoms = $(".puzzle-rule");
      //   ruleDoms.each(function (i, d) {
      //     const inputs = $(d).find("input");
      //     inputs.each(function (ii, dd) {
      //       $(dd).val(rules[i][mapKeys[ii]]);
      //     });
      //   });
      // }
      // 时间
      // $startTimePicker.datepicker("setDate", row.start_time);
      // $endTimePicker.datepicker("setDate", row.end_time);
      // // chcekbox 子任务
      // const checkboxs = $(".task-checkbox");
      // if (row.subtask_id_list?.length > 0) {
      //   for (let i = 0; i < row.subtask_id_list.length; i++) {
      //     for (let j = 0; j < checkboxs.length; j++) {
      //       if (row.subtask_id_list[i] == $(checkboxs[j]).val()) {
      //         $(checkboxs[j]).attr("checked", true);
      //       }
      //     }
      //   }
      // }
      // TASK_ID = row.task_id;
      // $taskDialog.dialog({
      //   minWidth: "800",
      // });
    },
  };

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
      {
        title: "状态",
        field: "status",
        formatter: function (value) {
          return value == 1 ? "开启" : "关闭";
        },
      },
      {
        title: "编辑",
        events: editSubTaskEvent,
        formatter: function () {
          return ["<button class='edit-btn'>编辑</button>"];
        },
      },
      {
        title: "删除",
        events: delSubTaskEvent,
        formatter: function () {
          return ["<button class='del-task-btn'>删除</button>"];
        },
      },
    ],
  });
});
