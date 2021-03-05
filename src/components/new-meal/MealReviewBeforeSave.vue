<template>
    <div class="meal-preview-container" v-if="mealInfo">
        <div class="meal-preview-fields-group d-flex">
            <div class="meal-preview-field-item image-field-container">
                <div class="meal-preview-field-item-header d-flex">
                    <span class="text-muted">Meal Image</span>
                    <EditBtn @on-clicked="emitGoToStepEvent(1)"></EditBtn>
                </div>
                <div class="meal-preview-field-item-image-holder">
                    <template v-if="mealInfo.imageUrl && mealInfo.imageUrl.length">
                        <img :src="mealInfo.imageUrl" alt="">
                    </template>
                    <template v-else>
                        <div class="empty-image-wrapper">
                            <span class="empty-image-wrapper-text">No image selected</span>
                        </div>
                    </template>
                </div>
            </div>
            <div class="meal-preview-field-item">
                <div class="meal-preview-field-item-header d-flex">
                    <span class="text-muted">Meal Info</span>
                    <EditBtn @on-clicked="emitGoToStepEvent(0)"></EditBtn>
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
                    <EditBtn @on-clicked="emitGoToStepEvent(2)"></EditBtn>
                </div>
                <div
                        class="meal-preview-field-item-bg-block"
                        v-bind:class="{ 'has-error': shouldShowMinPickupDateError }"
                >
                    <p>{{formattedPickupTime}}</p>
                </div>
                <small
                        class="text-danger d-block mt-2"
                        v-if="shouldShowMinPickupDateError"
                >Pickup time cannot be in the past</small>
            </div>
            <div
                    class="meal-preview-field-item location-field-container"
                    v-if="!hiddenFields || !hiddenFields.length || !hiddenFields.includes('location')"
            >
                <div class="meal-preview-field-item-header d-flex">
                    <span class="text-muted">Location</span>
                    <EditBtn @on-clicked="emitGoToStepEvent(2)"></EditBtn>
                </div>
                <div class="meal-preview-field-item-bg-block">
                    <p>{{mealInfo.placeAlias}}</p>
                </div>
            </div>
            <div class="meal-preview-field-item dietary-notes-field-container">
                <div class="meal-preview-field-item-header d-flex">
                    <span class="text-muted">Dietary Notes</span>
                    <EditBtn @on-clicked="emitGoToStepEvent(2)"></EditBtn>
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
import EditBtn from '../EditBtn';
export default {
    name: "MealReviewBeforeSave",
    components: {EditBtn},
    props: ['mealInfo', 'hiddenFields', 'hideQuantity'],
    data: () => ({
        shouldShowMinPickupDateError: false
    }),
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
    },
    created () {
        this.$eventHub.$on('show-min-pickup-date-error-on-review', () => {
            this.shouldShowMinPickupDateError = true;
        });
        this.$eventHub.$on('hide-min-pickup-date-error-on-review', () => {
            this.shouldShowMinPickupDateError = false;
        });
    },
    beforeDestroy () {
        this.$eventHub.$off('show-min-pickup-date-error-on-review');
        this.$eventHub.$off('hide-min-pickup-date-error-on-review');
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

                &.has-error {
                    border: 1px solid #E34425;
                }
            }

            .meal-preview-field-item-image-holder {
                width: 204px;
                height: auto;

                img {
                    width: 100%;
                    height: auto;
                }

                .empty-image-wrapper {
                    width: 100%;
                    background-color: #fff;
                    color: #181816;
                    padding: 16px;
                    font-size: 16px;
                    line-height: 24px;
                    font-family: $FilsonProRegular;
                    letter-spacing: 0;
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
