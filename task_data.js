// function  getUUId() {
//   var chars = '0123456789abcdefghijklmnopqrstuvwxyz'.split('');
//   var uuid = new Array(36), rnd = 0, r;
//   for (var i = 0; i < 36; i++) {
//       if (i == 8 || i == 13 || i == 18 || i == 23) {
//           uuid[i] = '-';
//       } else if (i == 14) {
//           uuid[i] = '4';
//       } else {
//           if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
//           r = rnd & 0xf;
//           rnd = rnd >> 4;
//           uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
//       }
//   }
//   return uuid.join('');
// }

$(document).ready(function () {
  const TEST_URL = "";
  const LANG_KEY = "zh-hans";
  $Select = $("#task-select");

  const renderTaskSelect = async () => {
    const data = {
      code: 0,
      message: "",
      data: {
        task_list: [
          {
            task_id: 1,
            name: '{"zh-hans":"第一期","zh-hant":"第一期","en":"Phase1"}',
            start_time: "123",
            end_time: "456",
            status: 1,
          },
        ],
      },
    };
    console.log("[[data.data]]", data.data);
    data.data.task_list.forEach((d) => {
      const parseItem = JSON.parse(d.name);
      console.log("parseItem", parseItem);
      $("#task-select").append(
        `<option value=${d.task_id}>${parseItem[LANG_KEY]}</option>`
      );
    });
  };

  renderTaskSelect();

  $Select.selectmenu({
    change: function (event, { item }) {
      console.log(item);
    },
  });

  const renderSubTaskTableData = () => {};

  const $taslTable = $("#sub-task-table");

  $taslTable.bootstrapTable({
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
      // 上传服务器的参数
      var temp = {
        name: $("#sname").val(),
        viewReason: $("#viewReason").val(),
      };
      return temp;
    },
    columns: [
      {
        title: "任务ID",
        field: "subtask_id",
      },
      {
        title: "任务名称",
        field: "name",
        formatter: formatterTaskName,
      },
      {
        title: "次数",
        field: "verification_count",
      },
      {
        title: "任务完成人数",
        field: "completed_count",
      },
    ],
  });

  // 格式化任务名
  function formatterTaskName(val) {
    return JSON.parse(val)[LANG_KEY];
  }

  // 游乐场
  const $rewardTable = $("reward-table");

  $rewardTable.bootstrapTable({
    method: "get",
    // /taskcenter/get_rewards
    url: "./mock_json.json", // 请求路径
    striped: true, // 是否显示行间隔色
    pageNumber: 1, // 初始化加载第一页
    pagination: true, // 是否分页
    sidePagination: "client", // server:服务器端分页|client：前端分页
    pageSize: 5, // 单页记录数
    pageList: [5, 20, 30],
    queryParams: function (params) {
      // // 上传服务器的参数
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
        title: "奖励名称",
        field: "name",
        formatter: formatterTaskName,
      },
      {
        title: "发起领取数量",
        field: "claimed_count",
      },
      {
        title: "已发放数量",
        field: "sent_count",
      },
      {
        title: "奖励总量",
        field: "total_count",
      },
    ],
  });
});
