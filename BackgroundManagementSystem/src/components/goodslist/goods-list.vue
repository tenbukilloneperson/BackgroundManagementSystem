<template>
  <div>
    <my-breadcrumb level2="商品管理" level3="商品列表"></my-breadcrumb>
    <el-row>
    <el-col :span="24">
      <div class="search">
        <el-input v-model="query" placeholder="请输入内容" clearable>
          <el-button @click="handleSearch" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" plain @click="$router.push({name: 'goodsadd'})">添加商品</el-button>
      </div>
    </el-col>
    </el-row>
    <!-- 商品列表 -->
     <el-table
      :data="tableData"
      stripe
      fit
      border
      v-loading="loading"
      style="width: 100%">
      <el-table-column
        type="index"
        label="#">
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称"
        width="500">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格(元)"
        width="120">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量"
        width="80">
      </el-table-column>
      <el-table-column
        label="创建时间"
        width="160">
        <template slot-scope="scope">
          {{scope.row.add_time | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary"
            size="mini"
            icon="el-icon-edit"
            plain></el-button>
          <el-button type="danger"
            @click="handleDelete(scope.row.goods_id)"
            size="mini"
            icon="el-icon-delete"
            plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>

export default {
  data() {
    return {
      loading: true,
      // 分页数据
      pagenum: 1,
      pagesize: 10,
      total: 0,
      // 查询参数
      query: '',
      tableData: []
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    // 加载商品列表
    async loadData() {
      const res = await this.$http.get('/goods', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      this.loading = false;
      if (res.data.meta.status === 200) {
        this.tableData = res.data.data.goods;
        this.total = res.data.data.total;
      }
    },
    // 查找
    handleSearch() {
    },
    // 分页
    handleSizeChange(val) {
      this.pagenum = 1;
      this.pagesize = val;
      this.loadData();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.loadData();
      console.log(`当前页: ${val}`);
    },
    // 删除
    async handleDelete(goodsId) {
      this.$confirm('是否要删除该商品？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`/goods/${goodsId}`);
        if (res.data.meta.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.loadData();
        } else {
          this.$message.error('删除失败');
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
};
</script>

<style scoped>
  .search .el-input {
    width: 300px;
  }
</style>
