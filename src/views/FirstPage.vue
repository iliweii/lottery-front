<template>
  <div class="fp-body">
    <iframe
      :width="iframeWidth"
      :height="iframeHeight"
      frameborder="0"
      scrolling="no"
      marginheight="0"
      marginwidth="0"
      src="https://surl.amap.com/3hHXiYhZfQE"
    ></iframe>

    <van-popup
      v-model="show"
      position="bottom"
      :overlay="false"
      round transition-appear
      safe-area-inset-bottom
      :style="{ height: '150px' }"
    >
      <div class="fp-popup">
        <van-button type="primary" icon="guide-o" block @click="handleNav">导航
        </van-button>
        <van-button type="primary" icon="flag-o" block plain @click="handleSign">去签到
        </van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "FirstPage",
  data() {
    return {
      iframeWidth: window.innerWidth, // 设置为页面宽度的90%
      iframeHeight: window.innerHeight - 150, // 设置为页面高度的50%
      show: true,
    };
  },
  methods: {
    updateIframeSize() {
      this.iframeWidth = window.innerWidth; // 你可以根据需求调整
      this.iframeHeight = window.innerHeight - 150; // 你可以根据需求调整
    },
    handleNav() {
      this.$router.push({name: "nav"});
    },
    handleSign() {
      this.$router.push({name: "sign"});
    },
  },
  created() {
    window.addEventListener("resize", this.updateIframeSize); // 页面大小变化时更新iframe大小
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateIframeSize); // 组件销毁时移除事件监听
  },
};
</script>

<style>
.fp-body {
  width: 100vw;
  height: 100vh;
}

iframe {
  display: block;
  width: 100%; /* 占据父容器的宽度 */
  height: 100%; /* 占据父容器的高度 */
}

.fp-popup {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 40px 20px 12px;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: space-between;
}
</style>
