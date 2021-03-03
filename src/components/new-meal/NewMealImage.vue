<template>
    <b-form class="new-meal-image-container" @submit.stop.prevent>
        <b-form-group>
            <div class="custom-legend">
                <span>Add an image</span>
                <template v-if="allowEnableEditField">
                    <EditBtn @on-clicked="enableEditField"></EditBtn>
                </template>
            </div>
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

            <template v-if="hasPrevImage()">
                <div class="image-preview-wrapper" v-bind:style="{ 'background-image': 'url(' + previousImageData.path + ')' }"></div>
                <div class="image-delete-wrapper">
                    <span v-if="!shouldDisableInput" @click="showConfirmDeleteImage">Delete Image</span>
                </div>
            </template>

            <template v-if="imageUrl && imageUrl.length">
                <div class="image-preview-wrapper" v-bind:style="{ 'background-image': 'url(' + imageUrl + ')' }"></div>
                <div class="image-delete-wrapper">
                    <span @click="clearImage">Delete Image</span>
                </div>
            </template>

            <div
                    class="upload-image-area"
                    v-bind:class="{ 'area-disabled': shouldDisableInput, 'is-dragging': isDragging }"
                    @click="triggerSelectFile"
                    @drop="handleDrop"
                    @dragleave="fileDragOut"
                    @dragover="fileDragIn"
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
    props: ['disabledFields', 'prevImage'],
    data: () => ({
        allowEnableEditField: false,
        shouldDisableInput: false,
        imageUrl: '',
        file: null,
        modalId: 'confirm-remove-meal-image',
        confirmRemoveMsg: 'Are you sure you want to remove this image?',
        isDragging: false,
        imageIdToDelete: '',
        previousImageData: null
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
            if (this.shouldDisableInput) return;
            let droppedFiles = e.dataTransfer.files;
            if(!droppedFiles) return;
            const file = droppedFiles[0];
            this.file = file;
            const _url = URL.createObjectURL(file);
            if (_url && _url.length) {
                this.imageUrl = _url;
            }
            this.isDragging = false;
        },
        fileDragIn () {
            if (this.shouldDisableInput) return;
            this.isDragging = true;
        },
        fileDragOut () {
            if (this.shouldDisableInput) return;
            this.isDragging = false;
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
                if (this.hasPrevImage()) {
                    this.onConfirmedRemove();
                }
                this.imageUrl = _url;
            }
        },
        hasPrevImage () {
            if (!this.previousImageData || !this.previousImageData.id) return false;
            return this.previousImageData.path && this.previousImageData.path.length > 0;
        },
        clearImage () {
            this.clearValue();
        },
        showConfirmDeleteImage () {
            this.$bvModal.show(this.modalId);
        },
        clearValue () {
            this.$refs.mealFileInput.value = null;
            this.imageUrl = '';
            this.file = null;
        },
        validate () {
            this.$emit('on-validate', {
                file: this.file,
                imageUrl: this.imageUrl,
                imageIdToDelete: this.imageIdToDelete
            }, true);
            return true;
        },
        onConfirmedRemove () {
            this.imageIdToDelete = this.previousImageData['id'] || '';
            this.previousImageData = null;
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
        },
        prevImage: function (newVal) {
            if (newVal && newVal.id) {
                this.previousImageData = { ...newVal };
            } else {
                this.previousImageData = null;
            }
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

            span {
                font-size: 18px;
                line-height: 18px;
                letter-spacing: 0.6px;
                padding: 0;
                margin: 0;
                font-family: $FilsonProBold;
                @media screen and (max-width: $tableMinWidth) {
                    font-size: 16px;
                    line-height: 17px;
                    letter-spacing: 0.53px;
                }
            }
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
        background-color: $mainBackgroundColor;

        &.area-disabled {
            background-color: #e9ecef;
        }
        &:not(.area-disabled) {
            cursor: pointer;

            &.is-dragging {
                background-color: #E5E5E5;
            }
            .upload-image-area-btn-wrapper {
                cursor: pointer;

                @media screen and (min-width: $tableMinWidth + 1) {
                    &:hover {
                        background-color: #8A877D;
                        span {
                            color: $mainBackgroundColor;
                        }
                    }
                }
            }
        }

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
            cursor: default;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
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
        background-size: cover;

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
