<template>
    <b-form class="new-meal-image-container">
        <b-form-group label="Add an image">
            <p class="mb-4 text-muted">You don’t need an image right now, you can always add this later…</p>
            <vue-dropzone v-if="dropzoneOptions" ref="myVueDropzone" id="dropzone" :options="dropzoneOptions" :useCustomSlot=true>
                <div class="dropzone-custom-content">
                    <!-- TODO: add correct icon -->
                    <i class="fa fa-cloud-download-alt fa-2x"></i>
                    <h3 class="dropzone-custom-title">Drag & drop an image</h3>
                </div>
            </vue-dropzone>
        </b-form-group>
    </b-form>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone';
export default {
    name: "NewMealImage",
    components: {
        vueDropzone: vue2Dropzone
    },
    data: () => ({
        mealId: '', // TODO
        dropzoneOptions: null,
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
    }
}
</script>

<style scoped lang="scss">
@import "../../variables";
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
</style>
