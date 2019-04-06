<template>
  <div>
    <my-breadcrumb
      level2='商品管理'
      level3='商品分类'></my-breadcrumb>
    <el-button type='success' @click="addCategoryVisible = true" plain>添加分类</el-button>
    <!-- 分类表格 -->
    <el-table v-loading="loading" :data="tableData" border max-height="400">
      <el-table-tree-column
          prop="cat_name"
          label="分类名称"
          tree-key="cat_id"
          level-key="cat_level"
          parent-key="cat_pid"
          child-key="children"
          :show-overflow-tooltip="true"
          width="320"
          :indent-size="20">
      </el-table-tree-column>
      <el-table-column
          label="级别" width="180">
        <template
          slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-if="scope.row.cat_level === 1">二级</span>
          <span v-if="scope.row.cat_level === 2">三级</span>
        </template>
      </el-table-column>
      <el-table-column
          label="是否有效" width="180">
        <template
          slot-scope="scope">{{ !scope.row.cat_deleted ? '有效' : '无效' }}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary"
            @click="openEditDialog(scope.row)"
            size="mini"
            icon="el-icon-edit"
            plain></el-button>
          <el-button type="danger"
            @click="handleDelete(scope.row.cat_id)"
            size="mini"
            icon="el-icon-delete"
            plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 编辑对话框 -->
    <el-dialog title="编辑商品分类" :visible.sync="editCategoryVisible">
      <el-form label-position="right" label-width="80px" :model="formData">
        <el-form-item label="分类名称">
          <el-input v-model="formData.cat_name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editCategoryVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加对话框 -->
    <el-dialog title="添加商品分类" :visible.sync="addCategoryVisible">
      <el-form label-position="right" label-width="80px" :model="formAddData">
        <el-form-item label="分类名称">
          <el-input v-model="formAddData.cat_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类名称">
          <el-cascader
            placeholder="默认添加一级分类"
            clearable
            expand-trigger="hover"
            :options="level2List"
            v-model="formAddData.selectedPIds"
            :props="{value: 'cat_id',label: 'cat_name', children: 'children'}"
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCategoryVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue';
import ElTreeGrid from 'element-tree-grid';

Vue.component(ElTreeGrid.name, ElTreeGrid);

export default {
  data() {
    return {
      tableData: [],
      // 添加商品分类的，父分类列表
      level2List: [],
      // 添加商品分类的时候，选中项绑定值，是一个数组
      selectedPIds: [],
      loading: false,
      editCategoryVisible: false,
      addCategoryVisible: false,
      formData: {
        cat_id: -1,
        cat_pid: -1,
        cat_name: ''
      },
      formAddData: {
        cat_name: '',
        selectedPIds: [],
        cat_pid: 0,
        cat_level: 0
      },
      // 分页数据
      pagesize: 5,
      pagenum: 1,
      total: 0
    };
  },
  mounted() {
    this.loadData();
    this.loadLevel2List();
  },
  methods: {
    // 添加商品分类的，父分类列表
    async loadLevel2List() {
      const res = await this.$http.get('/categories?type=2');
      if (res.data.meta.status === 200) {
        this.level2List = res.data.data;
      }
    },
    // 处理分页
    handleCurrentChange(val) {
      this.pagenum = val;
      this.loadData();
      console.log(`当前页: ${val}`);
    },
    // 加载商品分类数据列表
    async loadData() {
      this.loading = true;
      const res = await this.$http.get('/categories', {
        params: {
          type: 3,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      if (res.data.meta.status === 200) {
        this.loading = false;
        this.tableData = res.data.data.result;
        this.total = res.data.data.total;
      } else {
        this.loading = false;
        this.$message({
          type: 'error',
          message: '获取数据失败'
        });
      }
    },
    // 删除分类
    async handleDelete(catId) {
      this.$confirm('是否删除此商品分类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`/categories/${catId}`);
        if (res.data.meta.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.loadData();
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 打开编辑窗口
    async openEditDialog(cat) {
      this.editCategoryVisible = true;
      this.formData.cat_name = cat.cat_name;
      this.formData.cat_id = cat.cat_id;
    },
    // 修改商品分类
    async handleEdit() {
      const res = await this.$http.put(`/categories/${this.formData.cat_id}`, {
        cat_name: this.formData.cat_name
      });
      if (res.data.meta.status === 200) {
        this.editCategoryVisible = false;
        this.loadData();
        this.$message({
          type: 'success',
          message: '编辑分类成功'
        });
      } else {
        this.$message({
          type: 'error',
          message: '编辑分类失败'
        });
      }
    },
    async handleAdd() {
      const length = this.formAddData.selectedPIds.length;
      this.formAddData.cat_level = length;
      switch (length) {
        case 0:
          this.formAddData.cat_pid = 0;
          break;
        case 1:
          this.formAddData.cat_pid = this.formAddData.selectedPIds[0];
          break;
        case 2:
          this.formAddData.cat_pid = this.formAddData.selectedPIds[1];
          break;
        default:
      }

      const res = await this.$http.post('categories', this.formAddData);
      if (res.data.meta.status === 201) {
        this.loadData();
        this.loadLevel2List();
        this.addCategoryVisible = false;
        this.$message({
          type: 'success',
          message: '添加商品分类成功'
        });
      } else {
        this.$message({
          type: 'error',
          message: '添加商品分类失败'
        });
      }
    }
  }
};
</script>

<style scoped>

</style>
