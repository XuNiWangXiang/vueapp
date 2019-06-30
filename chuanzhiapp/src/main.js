//  入口文件
import Vue from 'vue'
// 1.1 导入路由的包
import VueRouter from 'vue-router'
// 1.2 安装路由
Vue.use(VueRouter)

// 注册 vuex
import Vuex from 'vuex'
Vue.use(Vuex)

// 每次进入网站，先从本地存储，把购物车数据放在store中
var car = JSON.parse(localStorage.getItem('car') || '[]')

var store = new Vuex.Store({
    state: { // this.$store.state.***
        car: car // 将购物车中的商品数据用一个数组存储起来{id:id, count:count, price: price,selected:ture}
    },
    mutations: { // this.$store.commit('方法名称','按需传递唯一参数')
        addToCar(state, goodsinfo){
            // 点击加入购物车，保存信息
            var flag = false

            state.car.some(item =>{
                if(item.id == goodsinfo.id) {
                    item.count += parseInt(goodsinfo.count)
                    flag = true
                    return true
                }
            })
            // 如果最终循环完毕，得到的flag还是false，则把商品数据直接push到数组中
            if(!flag) {
                state.car.push(goodsinfo)
            }
            // 当更新数组后，存储到本地localStorage中
            localStorage.setItem('car', JSON.stringify(state.car))
        },
        updateGoodsInfo(state, goodsinfo) {
            // 同步购物车页面修改购物车数值
            state.car.some(item => {
                if (item.id == goodsinfo.id) {
                    item.count = parseInt(goodsinfo.count)
                    return true
                }
            })
            // 每当修改商品的数量，同步到本地储存中
            localStorage.setItem('car',JSON.stringify(state.car))

        },
        removeFormCar(state, id) {
            // 根据id从store中的购物车中删除对应的那条商品数据
            state.car.some((item, i) => {
                if (item.id == id ){
                    state.car.splice(i, 1)
                    return true;
                }
            });
            // 删除完毕后，更新本地储存
            localStorage.setItem('car',JSON.stringify(state.car))
        },
        updateGoodsSekected(state, info) {
            state.car.some(item => {
                if(item.id == info.id){
                    item.selected = info.selected
                }
            })
            // 把更新了selected状态的购物车商品最新信息保存到store中
            localStorage.setItem('car',JSON.stringify(state.car))
        }
    },
    getters: { // this.$store.getters.***
        // 相当于计算属性，也相当于过滤器
        getAllCount(state) {
            var c =0;
            state.car.forEach(item =>{
                c += item.count
            })
            return c
        },
        getGoodsCount(state) {
            var o = {};
            state.car.forEach(item =>{
                o[item.id] = item.count                
            })
            return o
        },
        getGoodsSelected(state){
            var o = {}
            state.car.forEach(item =>{
                o[item.id] = item.selected

            })
            return o
        },
        getGoodsCountAndAmount(state) {
            var o = {
                count: 0,  // 勾选的数量
                amount: 0  //勾选的总价
            }
            state.car.forEach(item => {
                if (item.selected) {
                    o.count += item.count
                    o.amount += item.price * item.count
                }
            })
            return o
        }
    },
})


// 导入格式化时间插件
import moment from 'moment'
// 定义全局的过滤器
Vue.filter('dateFormat', function(dataStr,pattern = 'YYYY-MM-DD HH:mm:ss'){
    return moment(dataStr).format(pattern)
})




// 2.1 导入 vue-resource
import VueResource from 'vue-resource'
// 2.2 安装
Vue.use(VueResource)
// 设置请求的根路径
Vue.http.options.root = 'http://www.liulongbin.top:3005';
// 全局设置 ppost 表单数据格式组织形式
Vue.http.options.emulateJSON = true;


// 导入 MUI 的样式
import './lib/mui/css/mui.min.css'
import './lib/mui/css/icons-extra.css'

// // 按需导入 Mint-UI 中的组件
// import { Header,Swipe, SwipeItem, Button, Lazyload } from 'mint-ui'
// Vue.component(Header.name, Header)
// Vue.component(Swipe.name, Swipe);
// Vue.component(SwipeItem.name, SwipeItem);
// Vue.component(Button.name, Button);
// Vue.use(Lazyload);
import MintUI from 'mint-ui'
Vue.use(MintUI)
import 'mint-ui/lib/style.css'

// 安装图片预览插件
import VuePreview from 'vue-preview'
Vue.use(VuePreview)

// 1.3 导入自己的 router.js 路由模块
import router from './router.js'


// 导入app 根组件
import app from './App.vue'



var vm = new Vue({
    el: '#app',
    render: c => c(app),
    router, // 1.4 挂载路由对象到 VM 实例上
    store, // 挂载 store 状态管理对象
})