<template>
  <div>
    <my-breadcrumb
      level2="订单管理"
      level3="订单列表"></my-breadcrumb>
    <el-table
      :data="tableData"
      stripe
      border
      fit
      v-loading="loading"
      style="width: 100%">
      <el-table-column
        type="index"
        label="#">
      </el-table-column>
      <el-table-column
        prop="order_number"
        label="订单编号"
        width="300px">
      </el-table-column>
      <el-table-column
        prop="order_price"
        label="订单价格"
        width="80px">
      </el-table-column>
      <el-table-column
        prop="pay_status"
        label="是否付款"
        width="100px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.order_pay === '0'" type="danger">未付款</el-tag>
          <el-tag v-else type="success">已付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="is_send"
        label="是否发货">
      </el-table-column>
      <el-table-column
        label="下单时间">
        <template slot-scope="scope">
          {{scope.row.create_time | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary"
          size="mini"
          icon="el-icon-edit"
          plain
          @click="addFormVisible = true"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog title="修改订单地址"
      :visible="addFormVisible">
      <el-form
        label-position="right"
        label-width="100px">
        <el-form-item label="省市区/县">
          <el-cascader
            expand-trigger="hover"
            :options="options"
            v-model="selectedOptions"
            @change="handleChange"
            style="width: 500px">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import cityData from './city_data2017_element';

export default {
  data() {
    return {
      tableData: [],
      pagenum: 1,
      pagesize: 10,
      total: 0,
      loading: true,
      options: cityData,
      selectedOptions: [],
      addFormVisible: false
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$http.get('/orders', {
        params: {
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
    handleSizeChange(val) {
      this.pagenum = 1;
      this.pagesize = val;
      this.loadData();
      console.log(val);
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.loadData();
      console.log(val);
    },
    handleChange(val) {
      console.log(val);
    }
  }
};
</script>

<style>

</style>
