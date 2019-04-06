<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="4"><div class="grid-content bg-purple">
          <img src="/static/logo.png" alt="">
        </div></el-col>
        <el-col :span="16"><div class="grid-content bg-purple">
          <div class="title">电商后台管理系统</div>
        </div></el-col>
        <el-col :span="4"><div class="grid-content bg-purple">
          <a href="#" @click.prevent="logout" class="logout-btn">退出</a>
        </div></el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu default-active="users"
          :unique-opened="true"
          :router="true">
          <el-submenu
            v-for="(role, index) in roles"
            :key="role.id"
            :index="index + ''">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span slot="title">{{ role.authName }}</span>
            </template>
            <el-menu-item
              v-for="subRole in role.children"
              :key="subRole.id"
              :index="'/' + subRole.path">
              <i class="el-icon-menu"></i>
              <span>{{ subRole.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      roles: []
    };
  },
  mounted() {
    // this.$router.push({
    //   name: 'userlist'
    // });

    this.loadRoles();
  },
  methods: {
    logout() {
      this.$confirm('是否要退出系统？', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        // 1. 删除token
        localStorage.removeItem('token');
        // 2. 跳转到登录
        this.$router.push({
          name: 'login'
        });
        this.$message({
          type: 'success',
          message: '退出成功!'
        });
      }).catch(() => {
      });
    },
    async loadRoles() {
      const res = await this.$http.get('menus');
      if (res.data.meta.status === 200) {
        this.roles = res.data.data;
      } else {
        this.$message({
          type: 'error',
          message: '获取权限数据错误'
        });
      }
    }
  }
};
</script>

<style scoped>
  .el-header{
    background-color: #B3C0D1;
    padding: 0;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-header .title {
    color: #fff;
    font-size: 24px;
    height: 100%;
    line-height: 60px;
  }

  .logout-btn {
    position: absolute;
    right: 10px;
    color: orange;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    padding-top: 0;
  }
  .el-container {
    height: 100%;
  }

  /* 侧边导航 */
  .el-menu {
    width: 200px;
    height: 100%;
  }
</style>
