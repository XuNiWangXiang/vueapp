<template>
<div class="bckground-color">
    <div class="goods-list">
        <!-- 商品列表区域 -->
        <div class="mui-card" v-for="(item, i) in goodsList" :key="item.id">
            <div class="mui-card-content">
                <div class="mui-card-content-inner">
                    <mt-switch
                      v-model="$store.getters.getGoodsSelected[item.id]"
                      @change="selectedChanged(item.id,$store.getters.getGoodsSelected[item.id])"></mt-switch>
                    <img :src="item.thumb_path" alt="">
                    <div class="info">
                        <h1>{{ item.title }}</h1>
                        <p>
                            <span class="price">￥{{ item.sell_price}}</span>
                            <numbox :initcount="$store.getters.getGoodsCount[item.id]"
                             :goodsid="item.id"></numbox>
                            <a href="#" @click.prevent="remove(item.id, i)">删除</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <!-- 结算区域 -->
        <div class="mui-card">
            <div class="mui-card-content">
                <div class="mui-card-content-inner jiesuan">
                    <div class="left">
                        <p>总计（不含运费）</p>
                        <p>已勾选商品<span class="red">{{$store.getters.getGoodsCountAndAmount.count}}</span>
                        件，总价<span class="red">￥{{$store.getters.getGoodsCountAndAmount.amount}}</span></p>
                    </div>
                    <mt-button type="danger">去结算</mt-button>
                </div>
            </div>
        </div>
    </div>



</div>
</template>

<script>
// 导入numbox子组件
import numbox from '../subcomponents/shopcar_numbox.vue'
export default {
    data() {
        return {
            goodsList: [] // 购物车中所有数据
        }
    },
    created(){
        this.getGoodsList();
    },
    methods: {
        getGoodsList() {
            // 1. 获取到store中所有的商品id
            var idArr = []
            this.$store.state.car.forEach(item => idArr.push(item.id));
            // 如果购物车中没有商品，则直接返回，不需要请求接口
            if(idArr.length <= 0) {
                return;
            }
            // 2. 获取购物车列表
            this.$http
            .get('api/goods/getshopcarlist/' + idArr.join(","))
            .then(result => {
                if (result.body.status === 0) {
                    this.goodsList = result.body.message;
                    // console.log(this.goodsList[0].count)
                }
            });
        },
        remove(id , index) {
            //点击删除商品，store 和 当前组件中
            this.goodsList.splice(index,1);
            this.$store.commit('removeFormCar', id);
        },
        selectedChanged(id, val) {
            // 每当点击开关，把最新的开关状态同步到 store中
            this.$store.commit('updateGoodsSekected',{id,selected: val});
        }
    },
    components: {
        numbox
    }
}
</script>

<style lang='scss' scoped>
.bckground-color{
    background-color: #eee;
    overflow: hidden;
    .goods-list{
        .mui-card-content-inner{
            display: flex;
            align-items: center;
        }
        img{
            width: 60px;
            height: 60px;
        }
        h1{
            font-size: 14px;
        }
        .info{
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .price{
                color: red;
                font-weight: bold;
            }
        }
    }
    .jiesuan{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .red{
            color:red;
            font-size: 16px;
        }
    }
}
</style>
