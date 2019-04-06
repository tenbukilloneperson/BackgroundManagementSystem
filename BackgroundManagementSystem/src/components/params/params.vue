<template>
  <div>
    <my-breadcrumb
      level2="商品管理"
      level3="分类参数"></my-breadcrumb>
    <el-alert
      title="注意：只允许为第三级分类设置相关参数！"
      type="warning"
      :closable="false"
      show-icon>
    </el-alert>
    <!-- 级联下拉框 -->
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <span>请选择商品分类：</span>
          <el-cascader
            placeholder="请选择商品分类"
            expand-trigger="hover"
            :props="{ label: 'cat_name', value: 'cat_id' }"
            :options="options"
            v-model="selectedOptions"
            :show-all-levels="false"
            @change="handleChange">
          </el-cascader>
        </div>
      </el-col>
    </el-row>
    <!-- tab栏 -->
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="动态参数" name="many">
        <el-button
          :disabled="btnDisabled"
          class="btn-add"
          type="primary" size="small"
          @click="addDynamicFormVisible = true">添加动态参数</el-button>
        <el-table
          stripe
          border
          :data="dynamicTableData"
          style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-tag
                :key="index"
                v-for="(item, index) in scope.row.params"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row, index)">
                {{item}}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)">
              </el-input>
              <el-button v-else
                class="button-new-tag"
                size="small"
                @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="#"
            type="index">
          </el-table-column>
          <el-table-column
            label="商品参数"
            prop="attr_name"
            width="200px">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button type="primary"
                size="mini"
                icon="el-icon-edit"
                plain
                @click="openEditDynamic(scope.row)"></el-button>
              <el-button type="danger"
                size="mini"
                icon="el-icon-delete"
                plain
                @click="handleDelete(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="only">
        <el-button
          :disabled="btnDisabled"
          class="btn-add"
          type="primary" size="small"
          @click="addStaticFormVisible = true">添加静态参数</el-button>
        <el-table
          :data="staticTableData"
          stripe
          border
          style="width: 100%">
          <el-table-column
            type="index"
            label="#">
          </el-table-column>
          <el-table-column
            prop="attr_name"
            label="属性名称"
            width="200px">
          </el-table-column>
          <el-table-column
            prop="attr_vals"
            label="属性值">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button type="primary"
                size="mini"
                icon="el-icon-edit"
                plain
                @click="openEditStatic(scope.row)"></el-button>
              <el-button type="danger"
                size="mini"
                icon="el-icon-delete"
                plain
                @click="handleDelete(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 添加动态参数 -->
    <el-dialog title="添加动态参数"
      :visible.sync="addDynamicFormVisible">
      <el-form
        label-position="right"
        label-width="100px"
        :rules="rules"
        ref="addDynamicForm"
        :model="DynamicFormData">
        <el-form-item label="动态参数" prop="attr_name">
          <el-input v-model="DynamicFormData.attr_name"  auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDynamicFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddDynamic">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑动态参数 -->
    <el-dialog title="编辑动态参数"
      :visible.sync="editDynamicFormVisible">
      <el-form
        label-position="right"
        label-width="100px"
        :rules="rules"
        ref="editDynamicForm"
        :model="DynamicFormData">
        <el-form-item label="动态参数" prop="attr_name">
          <el-input v-model="DynamicFormData.attr_name"  auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDynamicFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditDynamic">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加静态参数 -->
    <el-dialog title="添加静态参数"
      :visible="addStaticFormVisible">
      <el-form
        label-position="right"
        label-width="100px"
        :rules="rules"
        ref="addStaticForm"
        :model="DynamicFormData">
        <el-form-item label="静态参数" prop="attr_name">
          <el-input v-model="DynamicFormData.attr_name"  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="静态参数值" prop="attr_vals">
          <el-input v-model="DynamicFormData.attr_vals"  auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addStaticFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddStatic">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑动态参数 -->
    <el-dialog title="编辑静态参数"
      :visible="editStaticFormVisible">
      <el-form
        label-position="right"
        label-width="100px"
        :rules="rules"
        ref="editStaticForm"
        :model="DynamicFormData">
        <el-form-item label="静态参数" prop="attr_name">
          <el-input v-model="DynamicFormData.attr_name"  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="静态参数值" prop="attr_vals">
          <el-input v-model="DynamicFormData.attr_vals"  auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editStaticFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditStatic">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [],
      selectedOptions: [],
      activeName: 'many',
      dynamicTableData: [],
      staticTableData: [],
      inputVisible: false,
      inputValue: '',
      btnDisabled: true,
      addDynamicFormVisible: false,
      editDynamicFormVisible: false,
      addStaticFormVisible: false,
      editStaticFormVisible: false,
      DynamicFormData: {
        attr_id: '',
        attr_name: '',
        attr_sel: 'many'
      },
      rules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ],
        attr_vals: [
          { required: true, message: '请输入参数值', trigger: 'blur' }
        ]
      }
    };
  },
  mounted() {
    this.loadOptions();
  },
  methods: {
    // 动态的tag标签
    async handleClose(row, index) {
      row.params.splice(index, 1);
      // postdata
      const postData = {};
      postData.attr_name = row.attr_name;
      postData.attr_sel = row.attr_sel;
      postData.attr_vals = row.params.join(',');
      row.attr_vals = postData.attr_vals;
      const url = `/categories/${row.cat_id}/attributes/${row.attr_id}`;
      const res = await this.$http.put(url, postData);
      if (res.data.meta.status === 200) {
        this.$message.success('更新成功');
      } else {
        this.$message.error('更新失败');
      }
    },
    async handleInputConfirm(row) {
      const inputValue = this.inputValue;
      if (inputValue) {
        row.params.push(inputValue);
        const postData = {};
        postData.attr_name = row.attr_name;
        postData.attr_sel = row.attr_sel;
        postData.attr_vals = row.params.join(',');
        row.attr_vals = postData.attr_vals;
        const url = `/categories/${row.cat_id}/attributes/${row.attr_id}`;
        const res = await this.$http.put(url, postData);
        if (res.data.meta.status === 200) {
          this.$message.success('更新成功');
        } else {
          this.$message.error('更新失败');
        }
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 级联下拉发生改变
    handleChange() {
      // console.log(val);
      // console.log(this.selectedOptions);
      if (this.selectedOptions.length !== 3) {
        this.dynamicTableData = [];
        this.staticTableData = [];
      } else {
        this.btnDisabled = false;
        this.loadTableData();
      }
    },
    async loadOptions() {
      const res = await this.$http.get('/categories?type=3');
      if (res.data.meta.status === 200) {
        this.options = res.data.data;
      }
    },
    // 点击tab
    handleTabClick() {
      if (this.selectedOptions.length === 3) {
        this.loadTableData();
      }
    },
    async loadTableData() {
      // 如果在实例创建之后添加新的属性到实例上，它不会触发视图更新
      const url = `categories/${this.selectedOptions[2]}/attributes?sel=${this.activeName}`;
      const res = await this.$http.get(url);
      if (res.data.meta.status === 200) {
        if (this.activeName === 'many') {
          this.dynamicTableData = res.data.data;
          // 给数组中的每一项添加params属性，把attr_vals用,分割，转换成数组存储到params中
          this.dynamicTableData.forEach((item) => {
            const arr = [];
            item.attr_vals.trim().split(',').forEach((item1) => {
              if (item1) {
                arr.push(item1);
              }
            });
            console.log(arr);
            this.$set(item, 'params', arr);
          });
        } else {
          this.staticTableData = res.data.data;
        }
      }
    },
    // 添加动态参数
    async handleAddDynamic() {
      this.$refs.addDynamicForm.validate(async (valide) => {
        if (!valide) {
          return;
        }
        const url = `/categories/${this.selectedOptions[2]}/attributes`;
        const res = await this.$http.post(url, this.DynamicFormData);
        if (res.data.meta.status === 201) {
          this.addDynamicFormVisible = false;
          this.$message.success('添加参数成功');
          this.loadTableData();
        } else {
          this.$message.error('添加参数失败');
        }
      });
    },
    // 删除参数
    async handleDelete(row) {
      // 删除提示
      this.$confirm('确认删除该参数？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.DynamicFormData.attr_sel = 'many';
        const url = `/categories/${row.cat_id}/attributes/${row.attr_id}`;
        const res = await this.$http.delete(url);
        if (res.data.meta.status === 200) {
          this.loadTableData();
          // 删除成功
          this.$message.success('删除成功');
        } else {
          this.$message.error('删除失败');
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 打开编辑动态参数的窗口
    openEditDynamic(row) {
      this.DynamicFormData.attr_id = row.attr_id;
      this.DynamicFormData.attr_name = row.attr_name;
      this.DynamicFormData.attr_vals = row.attr_vals;
      this.editDynamicFormVisible = true;
    },
    async handleEditDynamic() {
      const attrId = this.DynamicFormData.attr_id;
      const url = `/categories/${this.selectedOptions[2]}/attributes/${attrId}`;
      this.DynamicFormData.attr_sel = 'many';
      const res = await this.$http.put(url, this.DynamicFormData);
      if (res.data.meta.status === 200) {
        this.editDynamicFormVisible = false;
        this.loadTableData();
        this.$message.success('更新成功');
      } else {
        this.$message.error('更新失败');
      }
    },
    // 添加静态参数
    async handleAddStatic() {
      this.$refs.addStaticForm.validate(async (valide) => {
        if (!valide) {
          return;
        }
        this.DynamicFormData.attr_sel = 'only';
        const url = `/categories/${this.selectedOptions[2]}/attributes`;
        const res = await this.$http.post(url, this.DynamicFormData);
        if (res.data.meta.status === 201) {
          this.addStaticFormVisible = false;
          this.$message.success('添加参数成功');
          this.loadTableData();
        } else {
          this.$message.error('添加参数失败');
        }
      });
    },
    // 打开编辑静态参数的窗口
    openEditStatic(row) {
      this.DynamicFormData.attr_id = row.attr_id;
      this.DynamicFormData.attr_name = row.attr_name;
      this.DynamicFormData.attr_vals = row.attr_vals;
      this.editStaticFormVisible = true;
    },
    async handleEditStatic() {
      const attrId = this.DynamicFormData.attr_id;
      const url = `/categories/${this.selectedOptions[2]}/attributes/${attrId}`;
      this.DynamicFormData.attr_sel = 'only';
      const res = await this.$http.put(url, this.DynamicFormData);
      if (res.data.meta.status === 200) {
        this.editStaticFormVisible = false;
        this.loadTableData();
        this.$message.success('更新成功');
      } else {
        this.$message.error('更新失败');
      }
    }
  }
};
</script>

<style scoped>
.el-alert {
  margin-top: 20px;
  margin-bottom: 20px;
}
.el-col {
  margin-bottom: 20px;
}
.btn-add {
  margin-bottom: 20px;
}
</style>
