<template>
    <div v-if="user && user.id" class="connection-box user-info-line" v-bind:class="{ 'has-action-button' : hasRemoveAction }">
        <div class="connection-box-info">
            <template v-if="user.image && user.image.thumbnail && user.image.thumbnail.length">
                <div
                        class="connection-box-info-img mr-2 mr-xl-3"
                        @click="emitRedirectToCookProfile(user.id)"
                >
                    <img :src="user.image.thumbnail" alt="" class="img-fluid">
                </div>
            </template>
            <template v-else>
                <div
                        class="connection-box-info-img-placeholder mr-2 mr-xl-3"
                        @click="emitRedirectToCookProfile"
                >
                    <i class="fas fa-user-circle user-icon"></i>
                </div>
            </template>

            <div class="connection-box-info-name cursor-pointer">
                <span @click="emitRedirectToCookProfile">{{user.username}}</span>
            </div>
        </div>
        <div class="box-btn" v-if="hasRemoveAction">
            <b-btn
                    class="action-button btnNavyRedTransparent btnSmallSize hover-slide-left"
                    v-bind:class="{ btnDisabled: userToRemove && userToRemove.id === user.id }"
                    @click="emitRemoveUser"
            >
                <span class="pending" v-if="userToRemove && userToRemove.id === user.id">Pending</span>
                <span v-else>Remove</span>
            </b-btn>
        </div>
    </div>
</template>

<script>
export default {
    name: "UserInfoLine",
    props: ['user', 'hasRemoveAction', 'userToRemove'],
    methods: {
        emitRedirectToCookProfile () {
            this.$emit('redirect-to-cook-profile');
        },
        emitRemoveUser () {
            this.$emit('remove-user');
        }
    }
}
</script>

<style scoped lang="scss">
@import "../scss/utils/vars";
.connection-box.user-info-line {
    max-width: 100%;

    .connection-box-info {
        max-width: 100%;

        .connection-box-info-name {
            max-width: calc(100% - 60px);
            overflow: hidden;
            text-overflow: ellipsis;

            @media screen and (max-width: $tableMinWidth) {
                max-width: calc(100% - 50px);
            }
        }
    }
}
</style>
