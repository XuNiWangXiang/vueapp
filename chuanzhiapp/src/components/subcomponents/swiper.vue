<template>
    <div>
        <mt-swipe :auto="4000">
            <!-- 谁用此轮播图组件，谁传lunbotuList -->
            <mt-swipe-item v-for="item in lunbotuList" :key="item.id">
                <img :src="item.img" alt="" :class="{'full': isfull}">
            </mt-swipe-item>
        </mt-swipe>

    </div>
</template>

<script>
export default {
    props: ["lunbotuList", "isfull"]
};
</script>

<style lang="scss" scoped>
.mint-swipe{
    height: 200px;
    .mint-swipe-item{
        text-align: center;
        img {
            height: 100%;
        }
    }
}
.full{
    width: 100%;
}
</style>
