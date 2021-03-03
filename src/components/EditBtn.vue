<template>
    <b-btn class="edit-btn" @click.stop.prevent="onClicked">
        <SvgIcon icon="pencil"></SvgIcon>
        <span class="edit-btn-text">Edit</span>
    </b-btn>
</template>

<script>
import SvgIcon from './SvgIcon';
export default {
    name: "EditBtn",
    components: {SvgIcon},
    methods: {
        onClicked () {
            this.$emit('on-clicked');
        }
    }
}
</script>

<style scoped lang="scss">
@import "../scss/utils/vars";
.edit-btn {
    background: transparent;
    border: none;
    outline: none;
    color: $greenColor;
    padding: 0;
    margin-left: 20px;
    display: flex;
    width: 60px;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    height: 24px;

    &:active, &.active {
        border-color: transparent !important;
        background-color: transparent !important;
        color: $greenColor !important;
    }

    .edit-btn-text {
        font-family: $LacaProSemiBold;
        font-size: 18px;
        letter-spacing: 0.6px;
        line-height: 24px;
    }
    .svg-icon-wrapper {
        display: flex;
    }
}
</style>
