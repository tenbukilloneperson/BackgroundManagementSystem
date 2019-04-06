export default {
  data() {
    return {
      tableData: [],
      loading: true,
      addRoleFormVisible: false,
      editRoleFormVisible: false,
      addRoleFormData: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      // 控制权限分配的对话框的显示隐藏
      editRightsDialog: false,
      rightsData: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中的权限id
      checkedKeys: [],
      // 点击授权的时候记录下来当前的角色
      currentRole: {}
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    // 加载表格数据
    async loadData() {
      const res = await this.$http.get('/roles');
      if (res.data.meta.status === 200) {
        this.tableData = res.data.data;
        this.loading = false;
      }
    },
    // 添加角色
    async handleAddRole() {
      // 表单验证
      this.$refs.addRoleForm.validate(async (valid) => {
        if (!valid) {
          // 表单验证失败，返回
          return;
        }
        // 表单验证成功，添加角色
        this.addRoleFormVisible = false;
        const res = await this.$http.post('/roles', this.addRoleFormData);
        if (res.data.meta.status === 201) {
          this.$message({
            type: 'success',
            message: '创建角色成功'
          });
          // 重新加载数据
          this.loadData();
        } else {
          this.$message({
            type: 'erroe',
            message: '创建角色失败'
          });
        }
      });
    },
    // 删除角色
    async handleDelete(role) {
      // 删除提示
      this.$confirm('确认删除该角色？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 删除操作
        const { id: roleId } = role;
        const res = await this.$http.delete(`/roles/${roleId}`);
        if (res.data.meta.status === 200) {
          this.$message({
            type: 'success',
            message: '删除角色成功'
          });
          this.loadData();
        } else {
          this.$message({
            type: 'error',
            message: '删除角色失败'
          });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    async showEditRoleDialog(role) {
      // 显示编辑角色的对话框
      this.editRoleFormVisible = true;
      const { id: roleId } = role;
      const res = await this.$http.get(`/roles/${roleId}`);
      this.addRoleFormData = res.data.data;

      this.addOrEdit = 'edit';
    },
    // 编辑角色
    async handleEidtRole() {
      const { roleId } = this.addRoleFormData;
      const res = await this.$http.put(`/roles/${roleId}`, this.addRoleFormData);
      this.editRoleFormVisible = false;
      if (res.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: '编辑用户成功'
        });
        this.loadData();
      } else {
        this.$message({
          type: 'error',
          message: '编辑用户错误'
        });
      }
    },
    // 显示权限分配的对话框
    async showRightsDialog(role) {
      // 获取当前角色具有的权限id
      function getLevel3Ids(rightsList) {
        const arr = [];
        const fn = function (list) {
          list.forEach((item) => {
            if (!item.children) {
              arr.push(item.id);
            } else {
              fn(item.children);
            }
          });
        };
        fn(rightsList);
        return arr;
      }
      // 记录当前的角色
      this.currentRole = role;
      this.editRightsDialog = true;
      const res = await this.$http.get('/rights/tree');
      this.rightsData = res.data.data;
      // 设置选中的权限
      this.checkedKeys = getLevel3Ids(role.children);
    },
    // 分配权限
    async handleRights() {
      // 获取所有选中的权限id
      const nodes = this.$refs.tree.getCheckedNodes();
      let arr = [];
      nodes.forEach((item) => {
        // 选中的子权限id
        arr.push(item.id.toString());

        // 子权限的id 对应的父权限的id
        if (typeof (item.pid) === 'number') {
          arr.push(item.pid.toString());
        } else {
          arr = arr.concat(item.pid.split(','));
        }
      });

      // 数组去重
      const set = new Set(arr);

      const ids = [...set].join(',');

      const res = await this.$http.post(`/roles/${this.currentRole.id}/rights`, {
        rids: ids
      });
      if (res.data.meta.status === 200) {
        this.editRightsDialog = false;
        this.$message({
          type: 'success',
          message: '权限分配成功'
        });
        this.loadData();
      } else {
        this.$message({
          type: 'error',
          message: '权限分配失败'
        });
      }
    },
    // 删除权限
    async handleDeleteRights(role, rights) {
      // role 权限  rights 角色
      const res = await this.$http.delete(`/roles/${role.id}/rights/${rights.id}`);
      if (res.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: '删除权限成功'
        });
        // 重新绑定数据
        role.children = res.data.data;
      } else {
        this.$message({
          type: 'error',
          message: '删除权限失败'
        });
      }
    }

  }
};
