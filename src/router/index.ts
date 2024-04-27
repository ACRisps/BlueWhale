import {createRouter, createWebHashHistory} from "vue-router";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [{
        path: '/',
        redirect: '/login',
    }, {
        path: '/login',
        component: () => import('../views/user/Login.vue'),
        meta: {title: '用户登录'}
    }, {
        path: '/register',
        component: () => import('../views/user/Register.vue'),
        meta: {title: '用户注册'}
    }, {
        path: '/home',
        redirect: '/allStore',
        component: () => import('../views/Home.vue'),
        children: [
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: () => import('../views/user/Dashboard.vue'),
                meta: {title: '个人信息'}
            },
            //以下为Lab2新增，添加了商店模块的界面，请大家自己添加商品模块的界面
            {
                path: '/allStore',
                name: 'allStore',
                component: () => import('../views/store/AllStores.vue'),
                meta: {title: '商品列表界面/主页'}
            },
            //你也可以把创建商店界面改成一个弹窗
            {
                path: '/createStore',
                name: 'createStore',
                component: () => import('../views/store/CreateStore.vue'),
                meta: {
                    title: '创建商店',
                    permission: ['MANAGER']
                }
            },
            {
                path: '/storeDetail/:storeId',
                name: 'storeDetail',
                component: () => import('../views/store/StoreDetail.vue'),
                meta: {title: '店铺详情'}
            },
            {
                path: '/createProduct',
                name: 'createProduct',
                component: () => import('../views/product/CreateProduct.vue'),
                meta: {
                    title: '创建商品',
                    permission: ['STAFF']
                }
            },
            {
                path: '/productDetail/:productId',
                name: 'productDetail',
                component: () => import('../views/product/ProductDetail.vue'),
                meta: {title: '商品详情'}
            },
            {
                path: '/orders',
                name: 'orders',
                component: () => import('../views/order/Orders.vue'),
                meta: {
                    title: '订单管理',
                }
            },
            {
                path: '/publishCoupon',
                name: 'publishCoupon',
                component: () => import('../views/coupon/PublishCoupon.vue'),
                meta: {
                    title: '创建优惠券',
                }
            },
            {
                path: '/coupons',
                name: 'coupons',
                component: () => import('../views/coupon/Coupons.vue'),
                meta: {
                    title: '查看优惠券',
                }
            },

        ]
    }, {
        path: '/404',
        name: '404',
        component: () => import('../views/NotFound.vue'),
        meta: {title: '404'}
    }, {
        path: '/:catchAll(.*)',
        redirect: '/404'
    }]
});

router.beforeEach((to, _, next) => {
    const token: string | null = sessionStorage.getItem('token');
    const role: string | null = sessionStorage.getItem('role');

    if (to.meta.title) {
        document.title = to.meta.title;
    }

    if (token) {
        if (to.meta.permission) {
            if (to.meta.permission.includes(role!)) {
                next();
            } else {
                next('/404');
            }
        } else {
            next();
        }
    } else {
        if (to.path === '/login') {
            next();
        } else if (to.path === '/register') {
            next();
        } else {
            next('/login');
        }
    }
});

export {router};
