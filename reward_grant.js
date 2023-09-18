$(document).ready(function () {
  const $rewardSelect = $("#reward-select");
  const $grantStatusSelect = $("#grant-status-select");
  const $table = $("#reward-grant-table");

  const grantStatus = new Map([
    [1, "已领取待发出"],
    [2, "已发出"],
    [3, "已驳回"],
  ]);

  grantStatus.forEach((v, k) =>
    $grantStatusSelect.append(`<option value='${k}'>${v}</option>`)
  );

  $("#searchBtn").on("click", () => {
    // $rewardConfigTable.bootstrapTable("refresh");
  });

  $("#allRejectBtn").on("click", () => {
    // const rows = $table.bootstrapTable("getAllSelections");
    alert(rows[0].address);
  });

  $("#allGrantBtn").on("click", () => {
    // const rows = $table.bootstrapTable("getAllSelections");
    alert(rows[0].address);
  });

  $table.bootstrapTable({
    method: "get",
    url: "/reward_grant.json", // 请求路径
    striped: true, // 是否显示行间隔色
    pageNumber: 1, // 初始化加载第一页
    pagination: true, // 是否分页
    sidePagination: "client", // server:服务器端分页|client：前端分页
    pageSize: 5, // 单页记录数
    pageList: [5, 20, 30],
    // showRefresh : true,// 刷新按钮
    // queryParams: function (params) {
    //   return {
    //     event_id: "",
    //     uid: null,
    //     reward_id: null,
    //     status: $grantStatusSelect.value,
    //     page: params.pageNumber,
    //     page_size: params.pageSize,
    //   };
    // },
    // responseHandler: res => {
    //   $("#list-count").text(`共${res.total}条记录`)
    //   const rewards = res.reward_list
    //   if (rewards.length > 0) {
    //     Array.from(new Set(Object.values(JSON.parse(rewards[0].name))))
    //       .forEach(v => $rewardSelect.append(`<option value='${v}'>${v}奖励</option>`))
    //   }
    //   return rewards
    // },
    columns: [
      {
        checkbox: true,
        // width: 20,
        // formatter: (v, r, i) => r,
      },
      {
        title: "用户ID",
        field: "uid",
      },
      {
        title: "地址",
        field: "address",
      },
      {
        title: "领取时间",
        field: "claime_time",
        formatter: (timeMills) => new Date(timeMills).toLocaleString(),
      },
      {
        title: "状态",
        field: "status",
        formatter: (status) => grantStatus.get(status),
      },
    ],
  });
});
