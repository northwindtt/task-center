$(document).ready(function () {
  const $rewardConfigTable = $("#reward-config-table");
  const $rewardAddBtn = $("#add-reward-btn");
  const $configDialog = $("#config-dialog");
  const $confirDelDialog = $("#del-reward-dialog");
  const $inputZhHans = $("#name-zh-hans");
  const $inputZhHant = $("#name-zh-hant");
  const $inputEn = $("#name-en");
  const $inputLogo = $("#logo");
  const $inputTotal = $("#total-count");
  const $inputShow = $("#show-count");
  const $inputLevel = $("#level");
  const $inputPuzzle = $("#puzzle");
  const $select = $("#status-select");
  const $confirmBtn = $("#confirm-button");
  const delBtn = $("#del-config-btn");
  $configDialog.css("display", "none");
  $confirDelDialog.css("display", "none");

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
      key: "total_count",
      dom: $inputTotal,
    },
    {
      key: "show_count",
      dom: $inputShow,
    },
    {
      key: "need_level",
      dom: $inputLevel,
    },
    {
      key: "need_puzzle",
      dom: $inputPuzzle,
    },
  ];

  // 添加/更新奖励
  $confirmBtn.on("click", confirmConfig);
  function confirmConfig() {
    let params = {};

    try {
      inputArr.forEach((d) => {
        if (!d.dom.val()) {
          throw new Error("输入不能为空");
        } else {
          params[d.key] = d.dom.val();
        }
      });
    } catch (e) {
      alert(e);
      params = {};
    }
    params.status = $select.val();
    // create_or_modify_reward
  }

  // 格式化任务名
  function formatterNameJson(val) {
    return JSON.parse(val)["zh-hans"];
  }

  // 编辑奖励事件
  window.editRewardEvent = {
    "click .edit-btn": function (e, value, row, index) {
      const jsonParseName = JSON.parse(row.name);
      inputArr.forEach((d) => {
        if (["zh-hans", "zh-hant", "en"].indexOf(d.key) > -1) {
          d.dom.val(jsonParseName[d.key]);
        } else {
          d.dom.val(row[d.key]);
        }
      });
      $select.val(row.status);
      $configDialog.dialog({
        minWidth: "800",
      });
    },
  };

  // 删除奖励
  window.delRewardEvent = {
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

  $rewardAddBtn.on("click", function () {
    $configDialog.dialog({
      minWidth: "800",
    });
  });

  $rewardConfigTable.bootstrapTable({
    method: "get",
    url: "./reward.config.mock.json", // 请求路径
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
        title: "奖励名称",
        field: "name",
        formatter: formatterNameJson,
      },
      {
        title: "奖励个数（实际）",
        field: "total_count",
      },
      {
        title: "奖励个数（公开）",
        field: "show_count",
      },
      {
        title: "等级限制",
        field: "need_level",
      },
      {
        title: "拼图要求",
        field: "need_puzzle",
      },
      {
        title: "编辑",
        events: editRewardEvent,
        formatter: function () {
          return ["<button class='edit-btn'>查看</button>"];
        },
      },
      {
        title: "删除",
        events: delRewardEvent,
        formatter: function () {
          return ["<button class='del-btn'>删除</button>"];
        },
      },
    ],
  });
});
