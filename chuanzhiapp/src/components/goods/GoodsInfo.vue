<template>
    <div class="goodsinfo-container">
        <!-- 购物车小球 -->
        <transition 
            @before-enter="beforeEnter"
            @enter="enter"
            @after-enter="afterEnter">
            <div class="ball" v-show="ballFlag" ref="ball"></div>
        </transition>
        <!-- 商品轮播图区域 -->
        <div class="mui-card">
            <div class="mui-card-content">
                <div class="mui-card-content-inner">
                    <swiper :lunbotuList='lunbotu' :isfull="false"></swiper>
                </div>
            </div>
        </div>

        <!-- 商品购买区域 -->
        <div class="mui-card">
            <div class="mui-card-header">{{ goodsinfo.title }}</div>
            <div class="mui-card-content">
                <div class="mui-card-content-inner">
                    <p class="price">
                        市场价：<del>￥{{ goodsinfo.market_price}}</del>&nbsp;&nbsp;
                        销售价：<span class="now_price">￥{{ goodsinfo.sell_price }}</span>
                    </p>
                    <p>购买数量：<numbox @getcount="getSelectedCount"
                    :max="goodsinfo.stock_quantity"></numbox></p>
                    <p>
                        <mt-button type="primary" size="small">立即购买</mt-button>
                        <mt-button type="danger" size="small" @click="addToShopCar">加入购物车</mt-button>
                    </p>
                </div>
            </div>
        </div>
        <!-- 商品参数区域 -->
        <div class="mui-card">
            <div class="mui-card-header">商品参数</div>
            <div class="mui-card-content">
                <div class="mui-card-content-inner">
                    <p>商品货号：{{ goodsinfo.goods_no}}</p>
                    <p>库存情况：{{ goodsinfo.stock_quantity }}</p>
                    <p>上架时间：{{ goodsinfo.add_time | dateFormat }}</p>
                </div>
            </div>
            <div class="mui-card-footer">
                <mt-button type="primary" size="large" plain @click="goDesc(id)">图文介绍</mt-button>
                <mt-button type="danger" size="large" plain @click="goComment(id)">商品评论</mt-button>
            </div>
        </div>

    </div>
</template>

<script>
// 导入轮播组件，numbox组件
import swiper from '../subcomponents/swiper.vue'
import numbox from '../subcomponents/goodsinfo_numbox.vue'
export default {
    data() {
        return {
            id: this.$route.params.id, // 将路由参数对象中的id 挂载到data
            lunbotu: [], // 轮播图的数据
            goodsinfo: [], // 获取到的商品的信息
            ballFlag: false, // 控制小球隐藏显示的标识符
            selectedCount:1 // 保存用户选中的商品数量
        }
    },
    created() {
        this.getLunbotu();
        this.getGoodsInfo();
    },
    methods: {
        getLunbotu() {
            this.$http.get('api/getthumimages/' + this.id).then(result =>{
                if(result.body.status === 0){
                    // 县循环来宁波数组的每一项添加img属性
                    result.body.message.forEach(item =>{
                        item.img = item.src;
                    });
                    this.lunbotu = result.body.message;
                    // console.log(this.lunbotu)
                }
            })
        },
        getGoodsInfo(){
            // 获取商品的信息
            this.$http.get('api/goods/getinfo/' + this.id).then(result =>{
                this.goodsinfo = result.body.message[0];
                // console.log(this.goodsinfo)
            })
        },
        goDesc(id){
            // 点击使用编程式导航跳转到图文介绍页面
            this.$router.push({name:'goodsdesc', params: { id } })
        },
        goComment(id){
            // 点击跳转到评论页面
            this.$router.push({name:'goodscomment', params: { id } })
        },
        addToShopCar(){
            // 加入购物车, 拼接要加入数组的对象
            this.ballFlag = !this.ballFlag;
            var goodsinfo = {id: this.id,
                            count: this.selectedCount,
                            price:this.goodsinfo.sell_price,
                            selected:true
                            };
            // 调用store中的mutations来将商品加入购物车
            this.$store.commit("addToCar", goodsinfo);
            // console.log(this.$store.state.car);
        },

        beforeEnter(el){
            el.style.transform="translate(0,0)";
        },
        enter(el, done){
            el.offsetWidth;

            const ballPosition = this.$refs.ball.getBoundingClientRect();
            const badgePosition = document
              .getElementById('mui-badge')
              .getBoundingClientRect();
            const xDist = badgePosition.left - ballPosition.left;
            const yDist = badgePosition.top - ballPosition.top;

            el.style.transform = `translate(${xDist}px, ${yDist}px)`;
            el.style.transition = 'all 0.5s ease';
            done();
        },
        afterEnter(el){
            this.ballFlag = !this.ballFlag;
        },
        getSelectedCount(count) {
            // 当子组件把选中的数量传递给父组件是，把选中的值保存到 data 上
            this.selectedCount = count;
            // console.log('父组件拿到的值' + this.selectedCount)
        }
    },
    components: {
        swiper,
        numbox,
    }
}
</script>

<style lang="scss" scoped>
.goodsinfo-container{
    background-color: #eee;
    overflow: hidden;

    .now_price{
        color: red;
        font-size: 16px;
        font-weight: bold;
    }
    .mui-card-footer{
        display: block;
        button{
            margin: 10px 0;
        }
    }
    
    .ball{
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background-color: red;
        position: absolute;
        z-index: 99;
        top: 390px;
        left: 146px;
    }
}
</style>
