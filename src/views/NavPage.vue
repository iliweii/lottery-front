<template>
  <div class="fp-body">
    <iframe
      :width="iframeWidth"
      :height="iframeHeight"
      frameborder="0"
      scrolling="no"
      marginheight="0"
      marginwidth="0"
      src="https://m.amap.com/navi/?start=116.359390,39.887457&dest=116.386529,39.849681&destName=%E5%98%89%E5%94%90%E7%B2%A4%E5%AE%B4*%E8%9E%8D%E5%90%88%E8%8F%9C&naviBy=bus&key=c2f158957711d72aa068a9a9e82a922a&jscode=0170397382463f09ed4eeaa0530a2283"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: "NavPage",
  data() {
    return {
      iframeWidth: window.innerWidth, // 设置为页面宽度的90%
      iframeHeight: window.innerHeight, // 设置为页面高度的50%
    };
  },
  methods: {
    updateIframeSize() {
      this.iframeWidth = window.innerWidth; // 你可以根据需求调整
      this.iframeHeight = window.innerHeight; // 你可以根据需求调整
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
