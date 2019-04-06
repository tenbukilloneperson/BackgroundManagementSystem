<template>
  <div>
    <my-breadcrumb
      level2="权限管理"
      level3="权限列表"></my-breadcrumb>
    <el-table
      :data="tableData"
      v-loading="loading"
      border
      style="width: 100%">
      <el-table-column
        type="index"
        width="40">
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="200">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
        width="200">
      </el-table-column>
      <el-table-column
        label="层级"
        width="200">
        <template slot-scope="scope">
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-else-if="scope.row.level === '1'">二级</span>
          <span v-else-if="scope.row.level === '2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      loading: true
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$http.get('/rights/list');
      if (res.data.meta.status === 200) {
        this.loading = false;
        this.tableData = res.data.data;
      }
    }
  }
};
</script>

<style scoped>
</style>
