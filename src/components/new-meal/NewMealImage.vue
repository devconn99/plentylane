<template>
    <b-form class="new-meal-image-container">
        <b-form-group>
            <legend class="custom-legend">
                <span>Add an image</span>
                <template v-if="allowEnableEditField">
                    <EditBtn @on-clicked="enableEditField"></EditBtn>
                </template>
            </legend>
            <p class="mb-4 text-muted">You don’t need an image right now, you can always add this later…</p>
            <vue-dropzone v-if="dropzoneOptions" ref="myVueDropzone" id="dropzone" :options="dropzoneOptions" :useCustomSlot=true>
                <div class="dropzone-custom-content">
                    <!-- TODO: add correct icon -->
                    <img width="92px" height="90px" src="../../assets/icons/upload-to-cloud.svg" alt="">
                    <h3 class="dropzone-custom-title">Drag & drop an image</h3>
                </div>
            </vue-dropzone>
        </b-form-group>
    </b-form>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone';
import EditBtn from '../EditBtn';
export default {
    name: "NewMealImage",
    components: {
        vueDropzone: vue2Dropzone,
        EditBtn
    },
    props: ['disabledFields'],
    data: () => ({
        mealId: '', // TODO
        dropzoneOptions: null,
        allowEnableEditField: false
    }),
    mounted () {
        this.dropzoneOptions = {
            url: 'https://httpbin.org/post', // TODO
            thumbnailWidth: 150,
            maxFilesize: 10,
            maxFiles: 1,
            headers: { "My-Awesome-Header": "header value" }, // TODO
            acceptedFiles: 'image/*'
        }
    },
    methods: {
        enableEditField () {
            this.$nextTick(() => {
                this.allowEnableEditField = false;
                this.$refs.myVueDropzone.enable();
                this.$emit('should-allow-edit-meal-copy');
            });
        }
    },
    watch: {
        disabledFields: function (newVal) {
            if (!newVal || !newVal.length) {
                this.allowEnableEditField = false;
                this.$refs.myVueDropzone.enable();
                return;
            }
            this.$nextTick(() => {
                const _shouldDisableField = newVal.includes('image');
                this.allowEnableEditField = _shouldDisableField;
                if (_shouldDisableField) {
                    this.$refs.myVueDropzone.disable();
                } else {
                    this.$refs.myVueDropzone.enable();
                }
            });
        }
    }
}
</script>

<style scoped lang="scss">
@import "../../scss/utils/vars";
.dropzone-custom-content {
    width: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;

    .dropzone-custom-title {
        color: #8A877D;
        font-family: $FilsonProBold;
        font-size: 18px;
        letter-spacing: 0.6px;
        line-height: 18px;
        margin-top: 10px;
    }
}
.new-meal-image-container {
    .form-group {
        @media screen and (max-width: $tableMinWidth) {
            margin-bottom: 10px !important;
        }
        .custom-legend {
            display: flex;
            align-items: center;
            justify-content: space-between;
            line-height: 24px !important;
            margin-bottom: 6px !important;
        }
    }
}
</style>
