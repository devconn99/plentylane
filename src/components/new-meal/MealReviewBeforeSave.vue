<template>
    <div class="meal-preview-container" v-if="mealInfo">
        <div class="meal-preview-fields-group d-flex">
            <div class="meal-preview-field-item image-field-container">
                <div class="meal-preview-field-item-header d-flex">
                    <span class="text-muted">Meal Image</span>
                    <b-btn class="edit-btn" @click="emitGoToStepEvent(1)">
                        <SvgIcon icon="pencil"></SvgIcon>
                        <span class="edit-btn-text">Edit</span>
                    </b-btn>
                </div>
                <div class="meal-preview-field-item-image-holder">
                    <!-- TODO: use real image when it's ready -->
                    <img src="../../assets/images/data/images/dashboard/recepts/card__img-placeholder.svg" alt="">
                </div>
            </div>
            <div class="meal-preview-field-item">
                <div class="meal-preview-field-item-header d-flex">
                    <span class="text-muted">Meal Info</span>
                    <b-btn class="edit-btn" @click="emitGoToStepEvent(0)">
                        <SvgIcon icon="pencil"></SvgIcon>
                        <span class="edit-btn-text">Edit</span>
                    </b-btn>
                </div>
                <div class="meal-preview-field-item-bg-block">
                    <p class="meal-title">{{mealInfo.name}}</p>
                    <p class="meal-quantity" v-if="!hideQuantity">{{mealQuantityStr}}</p>
                    <p
                            class="meal-description"
                            v-if="mealInfo.description && mealInfo.description.length"
                    >{{mealInfo.description}}</p>
                </div>
            </div>
        </div>
        <div class="meal-preview-fields-group d-flex">
            <div
                    class="meal-preview-field-item pickup-time-field-container"
                    v-if="!hiddenFields || !hiddenFields.length || !hiddenFields.includes('pickupTime')"
            >
                <div class="meal-preview-field-item-header d-flex">
                    <span class="text-muted">Availability</span>
                    <b-btn class="edit-btn" @click="emitGoToStepEvent(2)">
                        <i class="fa fa-pencil-alt"></i>
                        <span class="edit-btn-text">Edit</span>
                    </b-btn>
                </div>
                <div class="meal-preview-field-item-bg-block">
                    <p>{{formattedPickupTime}}</p>
                </div>
            </div>
            <div
                    class="meal-preview-field-item location-field-container"
                    v-if="!hiddenFields || !hiddenFields.length || !hiddenFields.includes('location')"
            >
                <div class="meal-preview-field-item-header d-flex">
                    <span class="text-muted">Location</span>
                    <b-btn class="edit-btn" @click="emitGoToStepEvent(2)">
                        <SvgIcon icon="pencil"></SvgIcon>
                        <span class="edit-btn-text">Edit</span>
                    </b-btn>
                </div>
                <div class="meal-preview-field-item-bg-block">
                    <p>{{mealInfo.placeAlias}}</p>
                </div>
            </div>
            <div class="meal-preview-field-item dietary-notes-field-container">
                <div class="meal-preview-field-item-header d-flex">
                    <span class="text-muted">Dietary Notes</span>
                    <b-btn class="edit-btn" @click="emitGoToStepEvent(2)">
                        <SvgIcon icon="pencil"></SvgIcon>
                        <span class="edit-btn-text">Edit</span>
                    </b-btn>
                </div>
                <div class="meal-preview-field-item-bg-block" v-if="mealInfo.dietaryNotesText && mealInfo.dietaryNotesText.length">
                    <ul>
                        <li v-for="note in mealInfo.dietaryNotesText">{{note}}</li>
                    </ul>
                </div>
                <div class="meal-preview-field-item-bg-block" v-else-if="mealInfo.dietaryNotes && mealInfo.dietaryNotes.length">
                    <ul>
                        <li v-for="item in mealInfo.dietaryNotes">{{item.label}}</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import helpers from '../../helpers';
import SvgIcon from '../SvgIcon';
export default {
    name: "MealReviewBeforeSave",
    components: {SvgIcon},
    props: ['mealInfo', 'hiddenFields', 'hideQuantity'],
    methods: {
        emitGoToStepEvent (stepIndex) {
            this.$emit('go-to-step', stepIndex);
        }
    },
    computed: {
        formattedPickupTime: function () {
            if (!this.mealInfo || !this.mealInfo.pickupTime) {
                return '';
            }
            return helpers.parseDate(this.mealInfo.pickupTime, true);
        },
        mealQuantityStr: function () {
            let num = 0;
            if (this.mealInfo.quantity) {
                num = Number(this.mealInfo.quantity);
            }
            return `${num} Serving${num === 1 ? '' : 's'}`;
        }
    }
}
</script>

<style scoped lang="scss">
@import "../../scss/utils/vars";
.meal-preview-container {
    .meal-preview-fields-group {
        justify-content: space-between;

        @media screen and (max-width: $tableWidth) {
            flex-direction: column;

            .meal-preview-field-item {
                max-width: 100% !important;
                margin-left: 0 !important;
                margin-right: 0 !important;

                & + .meal-preview-field-item {
                    margin-top: 16px;
                }

                .meal-preview-field-item-image-holder {
                    width: 100% !important;
                    height: auto !important;
                }
            }
        }

        & + .meal-preview-fields-group {
            margin-top: 30px;

            @media screen and (max-width: $tableWidth) {
                margin-top: 16px;
            }
        }

        .meal-preview-field-item {
            width: 100%;

            &.image-field-container {
                max-width: 204px;
                min-width: 204px;
            }
            &.dietary-notes-field-container {
                min-width: 200px;
            }
            &.pickup-time-field-container {
                max-width: 204px;
                min-width: 204px;
            }
            &.location-field-container {
                min-width: 150px;
            }

            & + .meal-preview-field-item {
                margin-left: 25px;
            }

            .meal-preview-field-item-header {
                justify-content: space-between;
                align-items: center;
                font-family: $LacaProSemiBold;
                font-size: 18px;
                line-height: 18px;
                color: #8A877D;
                margin-bottom: 10px;

                .edit-btn {
                    background: transparent;
                    border: none;
                    outline: none;
                    color: $greenColor;
                    padding-left: 0;
                    padding-right: 0;
                    margin-left: 20px;

                    .edit-btn-text {
                        margin-left: 10px;
                        position: relative;
                        top: 3px;
                        font-family: $LacaProSemiBold;
                        font-size: 18px;
                        letter-spacing: 0.6px;
                        line-height: 24px;
                    }
                }
            }

            .meal-title {
                color: #181816;
                font-family: $LacaProSemiBold;
                font-size: 24px;
            }
            .meal-quantity {
                font-family: $FilsonProBold;
            }

            .meal-preview-field-item-bg-block {
                background-color: #fff;
                color: #181816;
                padding: 16px;
                font-size: 16px;
                line-height: 24px;
                font-family: $FilsonProRegular;
                letter-spacing: 0;
            }

            .meal-preview-field-item-image-holder {
                // temp
                width: 204px;
                height: 180px;

                img {
                    width: 100%;
                    height: auto;
                }
            }

            ul, li {
                list-style-type: disc;
            }
            ul {
                padding-left: 16px;
            }
        }
    }
}
</style>
