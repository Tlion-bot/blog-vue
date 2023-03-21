<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="全部订单" name="first">
        <List v-if="activeName === 'first'" />
      </el-tab-pane>
      <el-tab-pane label="未完成订单" name="second"
        ><List v-if="activeName === 'second'" status="0"
      /></el-tab-pane>
      <el-tab-pane label="已完成订单" name="third"
        ><List v-if="activeName === 'third'" status="3"
      /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import List from "./components/List";
export default {
  name: "CustomerOrder",
  components: {
    List,
  },
  data() {
    return {
      activeName: "first",
    };
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  padding: 0 !important;
}
</style>
