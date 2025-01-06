<template>
  <div>
    <van-nav-bar
      title="抽奖人员清单"
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
      <van-cell
        v-for="item in list"
        :key="item.id"
        :title="item.username"
      >
        <template #default>
          <span class="username-error" v-if="item.status === 0">
            <van-icon name="warning-o"/>未签到
          </span>
          <span class="username-signed" v-else-if="item.status === 1">
            <van-icon name="success"/>已签到
          </span>
          <span class="username-with" v-else-if="item.status === 2">
            <van-icon name="smile-o"/>随行人员
          </span>
        </template>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import {getAction} from "@/api/manage.js";

export default {
  name: "AdminRosterList",
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
      this.$router.push({name: "adminLogin"});
    }
  },
  methods: {
    onLoad() {
      const that = this;
      getAction("/system/people/roster", {pageSize: 999}).then((res) => {
        if (res.success) {
          let peopleList = res.result.records;
          that.list = peopleList;
        } else {
          that.$toast.fail("加载失败，请重试");
        }
        // 加载状态结束
        that.loading = false;
        that.finished = true;
      });
    }
  },
};
</script>

<style scoped>
.username-error {
  color: #ee0a24;
}

.username-signed {
  color: #1989fa;
}

.username-with {
  color: #07c160;
}
</style>