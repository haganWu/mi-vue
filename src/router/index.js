import {createRouter, createWebHashHistory} from 'vue-router'
import Login from '../views/login.vue'
import Main from "../views/main.vue"
import Home from "../views/home.vue"
import Role from "../views/role.vue"
import User from "../views/user.vue"
import Dept from "../views/dept.vue"
import NotFound from "../views/404.vue"


const routes = [{
    path: '/login',
    name: 'Login',
    component: Login
},
    {
        path: '/',
        name: 'Main',
        component: Main,
        children: [{
            path: '/home',
            name: 'Home',
            component: Home,
            meta: {
                title: '首页',
            }
        },
            {
                path: "/role",
                name: "Role",
                component: Role,
                meta: {
                    title: "角色管理",
                    isTab: true
                }
            },
            {
                path: '/user',
                name: 'User',
                component: User,
                meta: {
                    title: '用户管理',
                    isTab: true
                }
            },
            {
                path: '/dept',
                name: 'Dept',
                component: Dept,
                meta: {
                    title: '部门管理',
                    isTab: true
                }
            }
        ]
    },
    {
        path: "/404",
        name: "NotFound",
        component: NotFound
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: "/404"
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})
router.beforeEach((to, from, next) => {
    if (to.name != "Login") {
        let permissions = localStorage.getItem("permissions")
        let token = localStorage.getItem("token")
        if (permissions == null || permissions == "" || token == null || token == "") {
            next({
                name: 'Login'
            })
        }
    }
    return next()
})

export default router
