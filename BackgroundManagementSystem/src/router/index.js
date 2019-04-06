import Vue from 'vue';
import Router from 'vue-router';
import { Message } from 'element-ui';

import Login from '@/components/login/login';
import Home from '@/components/home/home';
import UserList from '@/components/userlist/user-list';
import RoleList from '@/components/rolelist/role-list';
import RightsList from '@/components/rightslist/rights-list';
import GoodsList from '@/components/goodslist/goods-list';
import GoodsCategories from '@/components/goodscategories/goods-categories';
import GoodsAdd from '@/components/goodsadd/goods-add';
import Report from '@/components/report/report';
import Order from '@/components/orders/orders';
import Params from '@/components/params/params';


Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        {
          name: 'userlist',
          path: '/users',
          component: UserList
        },
        {
          name: 'rolelist',
          path: '/roles',
          component: RoleList
        },
        {
          name: 'rightslist',
          path: '/rights',
          component: RightsList
        },
        {
          name: 'goodslist',
          path: '/goods',
          component: GoodsList
        },
        {
          name: 'goodsadd',
          path: '/goods/add',
          component: GoodsAdd
        },
        {
          name: 'goodscategories',
          path: '/categories',
          component: GoodsCategories
        },
        {
          name: 'report',
          path: '/reports',
          component: Report
        },
        {
          name: 'order',
          path: '/orders',
          component: Order
        },
        {
          name: 'params',
          path: '/params',
          component: Params
        }
      ]
    }
  ]
});

// 配置路由的拦截器
router.beforeEach((to, from, next) => {
  // 如果访问登录的路由地址，放过
  if (to.name === 'login') {
    next();
  } else {
    // 如果请求的不是登录页面，验证token
    // 1. 获取本地存储中的token
    const token = localStorage.getItem('token');
    if (!token) {
      Message({
        type: 'warning',
        message: '请先登录!'
      });
      // 2. 如果没有token，跳转到登录
      next({
        name: 'login'
      });
    } else {
      // 3. 如果有token，继续往下执行
      next();
    }
  }
});

export default router;
