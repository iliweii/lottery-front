<template>
  <div class="lottery">
    <van-image
      v-if="
        processList.length > 0 &&
        !loading &&
        countdown == 0 &&
        getAvatarUrl(processList[processList.length - 1].peopleId)
      "
      round
      width="8vh"
      height="8vh"
      fit="cover"
      class="avatar-image"
      :src="getAvatar(processList[processList.length - 1].peopleId)"
    >
    </van-image>
    <div class="names">{{ randomPeople }}</div>
    <van-row class="winners">
      <van-col v-for="item in processList" :key="item.peopleId" span="4">
        {{ getName(item.peopleId) }}
      </van-col>
    </van-row>
    <van-button
      type="info"
      :class="{ btns: true, active: countdown > 0 }"
      @click="handleLottery"
      :disabled="loading"
    ></van-button>
    <div class="countdown" v-if="countdown > 0">
      <span>{{ countdown }}</span>
    </div>

    <div class="result" v-if="showResult">
      <li-hua/>
    </div>
    <div class="result" v-if="showResult">
      <zhi-xie/>
    </div>
    <transition name="van-fade">
      <div v-show="showResult" class="result-text">
        <span>恭喜</span>🎉<br/>
        <!-- <span>{{ randomPeople }}</span> -->
      </div>
    </transition>
  </div>
</template>

<script>
import {getAction} from "@/api/manage.js";
import LiHua from "@/components/lihua.vue";
import ZhiXie from "@/components/zhixie.vue";

export default {
  name: "AdminLottery3",
  components: {LiHua, ZhiXie},
  data() {
    return {
      loading: false,
      finished: false,
      showResult: false,
      peopleList: [],
      processList: [],
      randomPeople: "开始",
      countdown: 0,
    };
  },
  mounted() {
    this.onLoad();

    // 监听全局事件
    window.addEventListener('websocketMessage', this.handleWebSocketMessage);
  },
  beforeDestroy() {
    // 清理事件监听器
    window.removeEventListener('websocketMessage', this.handleWebSocketMessage);
  },
  computed: {
    partList() {
      const ids = this.processList.map((e) => e.peopleId);
      return this.peopleList.filter((e) => !ids.includes(e.id));
    },
  },
  methods: {
    onLoad() {
      this.loading = true;
      const that = this;
      getAction("/system/people/list", {pageSize: 999}).then((res) => {
        if (res.success) {
          that.peopleList = res.result.records;
        } else {
          that.$toast.fail("加载失败，请重试");
        }
        this.loading = false;
      });
      getAction("/system/process/list", {pageSize: 999}).then((res) => {
        if (res.success) {
          that.processList = res.result.records;

          setTimeout(() => {
            if (that.processList.length > 0 && that.randomPeople === "开始") {
              that.randomPeople = that.getName(
                that.processList[that.processList.length - 1].peopleId
              );
            }
          }, 200);
        } else {
          that.$toast.fail("加载失败，请重试");
        }
        this.loading = false;
      });
    },
    handleLottery() {
      this.loading = true;
      const that = this;
      this.$toast.loading({
        duration: 0,
        forbidClick: false,
        message: "抽奖加载中...",
      });
      getAction("/system/process/draw", {})
        .then((res) => {
          if (res.success) {
            this.$toast.clear();
            that.handleDraw(res.result);
          } else {
            that.$toast.fail(res.message);
          }
        })
        .catch(() => {
          that.$toast.fail("抽奖失败了，再试一次吧！");
        })
        .finally(() => {
          that.loading = false;
        });
    },
    handleDraw(result, time = 5) {
      this.$emit('start');
      const that = this;
      let timer = setInterval(() => {
        const randomNumber = Math.floor(Math.random() * this.partList.length);
        that.randomPeople = this.partList[randomNumber]?.peopleName;
      }, 50);
      that.countdown = time;
      if (result.processTotal <= 1) {
        that.countdown = 1;
      }
      let timer2 = setInterval(() => {
        that.countdown--;
        if (that.countdown <= 0) {
          clearInterval(timer);
          that.randomPeople = that.getName(result.peopleId);
          clearInterval(timer2);
          that.processList.push(result);

          that.showResult = true;
          setTimeout(() => {
            that.showResult = false;
            this.$emit('done');
          }, 5 * 1000);
        }
      }, 1000);
    },
    getName(id) {
      let peopleFilter = this.peopleList.filter((e) => e.id === id);
      if (peopleFilter.length > 0) return peopleFilter[0]?.peopleName;
      else return "";
    },
    getAvatarUrl(id) {
      let peopleFilter = this.peopleList.filter((e) => e.id === id);
      if (peopleFilter.length > 0) return peopleFilter[0].peopleAvatar;
      else return "";
    },
    getAvatar(id) {
      let url = this.getAvatarUrl(id);
      return window._CONFIG["domianURL"] + "/common/static/" + url;
    },
    handleWebSocketMessage(event) {
      try {
        // 获取消息数据
        const data = JSON.parse(event.detail);
        // 处理接收到的消息
        if (data.type === '倒计时' && data.extParams && this.countdown <= 0) {
          this.handleDraw(data.extParams.result, data.extParams.countdown);
        } else if (data.type === '重置抽奖') {
          this.onLoad();
        }
      } catch (e) {
        console.error(e.message);
      }
    }
  },
};
</script>


<style scoped lang="scss">
.lottery {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-position: center;
  background-size: cover;

  .avatar-image {
    position: absolute;
    left: 12px;
    // bottom: calc(3% + 10px);
    top: calc(10vh + 5px);
    z-index: 0;
    border: rgb(222, 28, 49) solid 2px;
    box-shadow: rgba(0, 0, 0, 0.05) 1px 1px 10px 1px;
  }

  .names {
    position: absolute;
    width: 80%;
    height: 72px;
    // bottom: 3%;
    top: 10vh;
    left: 50%;
    font-size: 48px;
    font-weight: 100;
    text-align: center;
    line-height: 72px;
    letter-spacing: 24px;
    text-indent: 24px;
    color: #fff; /* 使用鲜艳的红色或其他明亮颜色，使名字更加显眼 */
    text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3); /* 给文字添加阴影，使其更有立体感 */
    padding: 20px 40px; /* 添加一些内边距，避免文字贴边 */
    border-radius: 8px; /* 让名字周围的背景有圆角，增加现代感 */
    background: linear-gradient(45deg, #ff6f00, #ff4081); /* 渐变背景颜色，增加视觉冲击 */
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); /* 设置阴影，使文字浮动感更强 */
    transform: translateY(-20px) translateX(-50%); /* 让名字轻微上浮 */
  }

  .winners {
    display: none;
  }

  .btns {
    display: none;
  }

  .countdown {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.05);
    z-index: 10;
    text-align: center;
    box-sizing: border-box;
    padding-top: 10vh;

    span {
      display: inline-block;
      font-size: 288px;
      color: #fff;
      font-family: sans-serif;
      animation: scaleUp 1s ease-in infinite;
      text-shadow: #000 0 0 1px;
    }

    @keyframes scaleUp {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      100% {
        transform: scale(2.5);
        opacity: 0.3;
      }
    }
  }

  .result {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    z-index: 10;
  }

  .result-text {
    position: absolute;
    right: 10%;
    top: 20vh;
    font-size: 3rem;
    z-index: 1;
    text-align: right;

    span {
      background: linear-gradient(
          45deg,
          yellow,
          lime,
          aqua,
          dodgerblue,
          fuchsia,
          darkorange
      ) 0 / 50%;
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: hue 6s infinite;
      text-shadow: rgba(255, 255, 255, 0.5) 0 0 1px;
      letter-spacing: 6px;
      line-height: 1.5;
      text-indent: 6px;
      // padding-left: 38px;
    }
  }
}

@keyframes hue {
  from {
    filter: hue-rotate(0deg);
  }
  to {
    filter: hue-rotate(360deg);
  }
}

@media (min-width: 850px) {
  /* 在此添加你想要应用的样式 */
  .lottery {
    /* 在此处添加样式b的样式 */
    background-size: contain;

    .result {
      width: 30%;
      left: 20%;
    }
  }
}
</style>