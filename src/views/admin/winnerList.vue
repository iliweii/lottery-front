<template>
  <div>
    <van-nav-bar
      title="获奖者名单"
      left-text="返回"
      left-arrow
      @click-left="() => this.$router.back()"
    />
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell-group
        v-for="(item, index) in list"
        :key="item.id"
        :title="`第${index + 1}位获奖者`"
      >
        <van-cell :title="item.processRemark" :value="item.createTime" />
      </van-cell-group>
    </van-list>
  </div>
</template>
  
  <script>
import { getAction } from "@/api/manage.js";

export default {
  name: "AdminWinnerList",
  data() {
    return {
      loading: false,
      finished: false,
      list: [],
    };
  },
  mounted() {
    let admin = this.$ls.get("ADMIN");
    if (!admin) {
      this.$router.push({ name: "adminLogin" });
    }

    // 监听全局事件
    window.addEventListener('websocketMessage', this.handleWebSocketMessage);
  },
  beforeDestroy() {
    // 清理事件监听器
    window.removeEventListener('websocketMessage', this.handleWebSocketMessage);
  },
  methods: {
    onLoad() {
      const that = this;
      getAction("/system/process/list", { pageSize: 999 }).then((res) => {
        if (res.success) {
          let processList = res.result.records;
          that.list = processList;
        } else {
          that.$toast.fail("加载失败，请重试");
        }
        // 加载状态结束
        that.loading = false;
        that.finished = true;
      });
    },
    handleWebSocketMessage(event) {
      try {
        // 获取消息数据
        const data = JSON.parse(event.detail);
        // 处理接收到的消息
        if (data.type === '倒计时结束' || data.type === '重置抽奖') {
          this.onLoad();
          this.$toast.success("自动刷新成功");
        }
      } catch (e) {
        console.error(e.message);
      }
    }
  },
};
</script>
  