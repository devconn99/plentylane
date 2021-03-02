<template>
    <b-form class="new-meal-image-container" @submit.stop.prevent @dragover.prevent @drop.prevent>
        <b-form-group>
            <legend class="custom-legend">
                <span>Add an image</span>
                <template v-if="allowEnableEditField">
                    <EditBtn @on-clicked="enableEditField"></EditBtn>
                </template>
            </legend>
            <p class="mb-4 text-muted">You don’t need an image right now, you can always add this later…</p>

            <input
                    id="meal-image_input"
                    class="d-none"
                    ref="mealFileInput"
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    :disabled="shouldDisableInput"
                    @change="onFileChange"
            />

            <template v-if="imageUrl && imageUrl.length">
                <div class="image-preview-wrapper" v-bind:style="{ 'background-image': 'url(' + imageUrl + ')' }"></div>
                <div class="image-delete-wrapper">
                    <span @click="clearImage">Delete Image</span>
                </div>
            </template>

            <div
                    class="upload-image-area"
                    @click="triggerSelectFile"
                    @drop="handleDrop"
                    @dragleave="fileDragOut"
                    @dragover="fileDragIn"
                    v-bind:style="{ 'background-color': bg }"
            >
                <!-- TODO: use correct icon -->
                <img class="upload-icon" width="92px" height="90px" src="../../assets/icons/upload-to-cloud.svg" alt="">
                <h3 class="upload-image-area-title">
                    <span class="d-block p-0 m-0">Drag & drop an image</span>
                    <span class="d-block p-0 mb-0 mt-2">or</span>
                </h3>
                <div class="upload-image-area-btn-wrapper">
                    <span>Upload Image</span>
                </div>
            </div>
        </b-form-group>

        <!-- Modals -->
        <ConfirmModal :id="modalId" :message="confirmRemoveMsg" @confirmed="onConfirmedRemove"></ConfirmModal>
    </b-form>
</template>

<script>
import EditBtn from '../EditBtn';
import ConfirmModal from '../modals/ConfirmModal';
export default {
    name: "NewMealImage",
    components: {EditBtn, ConfirmModal},
    props: ['disabledFields', 'prevImageUrl'],
    data: () => ({
        allowEnableEditField: false,
        shouldDisableInput: false,
        imageUrl: '',
        file: null,
        defaultBg: '#FEF8E6',
        bg: '#FEF8E6',
        modalId: 'confirm-remove-meal-image',
        confirmRemoveMsg: 'Are you sure you want to remove this image?'
    }),
    methods: {
        enableEditField () {
            this.$nextTick(() => {
                this.allowEnableEditField = false;
                this.shouldDisableInput = false;
                this.$emit('should-allow-edit-meal-copy');
            });
        },
        triggerSelectFile () {
            this.$refs.mealFileInput.click();
        },
        handleDrop (e) {
            this.bg = this.defaultBg;
            let droppedFiles = e.dataTransfer.files;
            if(!droppedFiles) return;
            const file = droppedFiles[0];
            this.file = file;
            const _url = URL.createObjectURL(file);
            if (_url && _url.length) {
                this.imageUrl = _url;
            }
        },
        fileDragIn () {
            this.bg = '#E5E5E5';
        },
        fileDragOut () {
            this.bg = this.defaultBg;
        },
        onFileChange (e) {
            this.$nextTick(() => {
                if (document.activeElement) {
                    document.activeElement.blur();
                }
            });
            if (!e || !e.target || !e.target.files || !e.target.files.length) return;
            const file = e.target.files[0];
            this.file = file;
            const _url = URL.createObjectURL(file);
            if (_url && _url.length) {
                this.imageUrl = _url;
            }
        },
        clearImage () {
            // show confirm if previous value exists
            if (this.prevImageUrl && this.prevImageUrl.length) {
                this.$bvModal.show(this.modalId);
            } else {
                this.clearValue();
            }
        },
        clearValue () {
            this.$refs.mealFileInput.value = null;
            this.imageUrl = '';
            this.file = null;
        },
        validate () {
            // TODO: need to send some flag in case the image needs to be removed at all
            this.$emit('on-validate', { file: this.file, imageUrl: this.imageUrl }, true);
            return true;
        },
        onConfirmedRemove () {
            this.clearValue();
        }
    },
    watch: {
        disabledFields: function (newVal) {
            if (!newVal || !newVal.length) {
                this.allowEnableEditField = false;
                this.shouldDisableInput = false;
                return;
            }
            this.$nextTick(() => {
                const _shouldDisableField = newVal.includes('image');
                this.allowEnableEditField = _shouldDisableField;
                this.shouldDisableInput = !!_shouldDisableField;
            });
        }
    }
}
</script>

<style scoped lang="scss">
@import "../../scss/utils/vars";
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

    .upload-image-area {
        width: 100%;
        min-height: 303px;
        height: 100%;
        border: 3px dashed $grayColor;
        padding: 35px 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        @media screen and (max-width: $tableMinWidth) {
            min-height: auto;
            border: none;
            padding: 0;
            margin-top: 40px;
        }

        .upload-icon, .upload-image-area-title {
            @media screen and (max-width: $tableMinWidth) {
                display: none;
            };
        }

        .upload-image-area-title, .upload-image-area-btn-wrapper span {
            color: #8A877D;
            font-family: $FilsonProBold;
            font-size: 18px;
            letter-spacing: 0.6px;
            line-height: 18px;
            text-align: center;
        }
        .upload-image-area-title {
            margin-top: 10px;
        }
        .upload-image-area-btn-wrapper {
            border: 3px solid #8A877D;
            background-color: transparent;
            color: #8A877D;
            width: 200px;
            margin: 20px auto 0;
            padding: 18px 15px;
            text-align: center;
            cursor: pointer;
            -webkit-transition: all 0.3s ease;
            -moz-transition: all 0.3s ease;
            -ms-transition: all 0.3s ease;
            -o-transition: all 0.3s ease;
            transition: all 0.3s ease;

            @media screen and (max-width: $tableMinWidth) {
                margin-top: 0;
                width: 100%;
            }
            @media screen and (min-width: $tableMinWidth + 1) {
                &:hover {
                    background-color: #8A877D;
                    span {
                        color: $mainBackgroundColor;
                    }
                }
                span {
                    -webkit-transition: all 0.3s ease;
                    -moz-transition: all 0.3s ease;
                    -ms-transition: all 0.3s ease;
                    -o-transition: all 0.3s ease;
                    transition: all 0.3s ease;
                }
            };
        }
    }

    .image-preview-wrapper {
        width: 100%;
        min-height: 303px;
        margin: 0;
        // NOTE, no need to combine background properties into one
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;

        @media screen and (max-width: $tableMinWidth) {
            min-height: 200px;
        }

    }
    .image-delete-wrapper {
        margin-top: 20px;
        margin-bottom: 20px;
        user-select: none;
        text-align: center;

        span {
            text-decoration: underline;
            color: $greenColor;
            font-family: $FilsonProBold;
            font-size: 16px;
            letter-spacing: 0;
            line-height: 24px;
            cursor: pointer;
            -webkit-transition: all 0.3s ease;
            -moz-transition: all 0.3s ease;
            -ms-transition: all 0.3s ease;
            -o-transition: all 0.3s ease;
            transition: all 0.3s ease;

            &:hover {
                text-decoration: none;
                color: $greenColor;
            }
        }
    }
}
</style>
