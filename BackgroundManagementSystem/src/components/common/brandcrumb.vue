<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{ level2 }}</el-breadcrumb-item>
    <el-breadcrumb-item>{{ level3 }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'MyBreadcrumb',
  data() {
    return {
    };
  },
  props: ['level2', 'level3']
};
</script>

<style>
.el-breadcrumb {
  background-color: #d3dce6;
  height: 45px;
  font-size: 15px;
  padding-left: 10px;
  line-height: 45px;
}
</style>
