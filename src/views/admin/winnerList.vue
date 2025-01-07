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
        <van-cell :title="item.processRemark" :value="item.createTime" @click="showDetail(item, index)"/>
      </van-cell-group>
    </van-list>

    <van-dialog v-model="detailShow" :title="detailTitle" show-cancel-button :show-confirm-button="false"
                cancel-button-text="关闭" close-on-click-overlay>
      <p class="tip">本次抽奖基数（本次抽奖开始时的未中奖人数）为 <b class="b">{{ detailItem.processTotal }}</b>，子抽奖次数（随机数）为 <b
        class="b">{{ detailItem.processTime }}</b>，每次子抽奖详情如下：</p>
      <van-cell-group inset class="scroll-body">
        <van-cell v-for="(name, i) in detailItem?.details" :key="i" :title="i + 1">
          <template #default>
            <span v-if="i < detailItem.details.length - 1">{{ name }}</span>
            <b v-else class="b">{{ name }}</b>
          </template>
        </van-cell>
      </van-cell-group>
      <p class="tip small">
        <van-icon name="info-o"/>
        即最后一次子抽奖中奖者为本次抽奖中奖者
      </p>
    </van-dialog>
  </div>
</template>

<script>
import {getAction} from "@/api/manage.js";

export default {
  name: "AdminWinnerList",
  data() {
    return {
      loading: false,
      finished: false,
      list: [],
      detailShow: false,
      detailTitle: '',
      detailItem: {},
    };
  },
  mounted() {
    let admin = this.$ls.get("ADMIN");
    if (!admin) {
      this.$router.push({name: "adminLogin"});
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
      getAction("/system/process/list", {pageSize: 999}).then((res) => {
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
    },
    showDetail(item, index) {
      this.detailShow = true;
      this.detailTitle = `第${index + 1}次抽奖明细数据`;
      this.detailItem = item;
      this.detailItem.details = item?.processInfo?.split(',') || [];
    },
  },
};
</script>

<style scoped>
.tip {
  font-size: 14px;
  padding: 0 14px;
}

.tip.small {
  font-size: 12px;
  color: #999;
}

.b {
  color: dodgerblue;
}

.scroll-body {
  max-height: 150px;
  overflow-y: auto;
}
</style>