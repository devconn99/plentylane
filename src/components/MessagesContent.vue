<template>
    <div class="msg-wrapper" v-if="isLoaded">
        <div class="msg-header">
            <!-- TODO: refactor this block later -->
            <div class="msg-line"></div>
            <div class="msg-meal-info-wrapper">
                <p class="m-0">You commented on Jimmy R.'s</p>
                <p class="msg-meal-link m-0" @click="redirectToOffer">Baby Back Ribs</p>
            </div>
        </div>
        <div class="msg-content" ref="msgContent" v-if="messages && messages.length">
            <div
                    class="msg-item"
                    v-for="(msg, index) in messages"
                    v-bind:key="msg.id"
                    v-bind:class="{ 'your-msg': msg.isCurrentUserMsg }"
            >
                <template v-if="msg.isCurrentUserMsg">
                    <template v-if="index === 0">
                        <div class="msg-time">{{msg.displayTime}}</div>
                    </template>
                    <template v-else-if="index - 1 > 0 && msg.displayTime !== messages[index - 1].displayTime">
                        <div class="msg-time">{{msg.displayTime}}</div>
                    </template>
                </template>
                <template v-else>
                    <div
                            class="msg-user-wrapper"
                            v-if="index - 1 >= 0 && msg.displayTime !== messages[index - 1].displayTime"
                    >
                        <div class="msg-user-icon">
                            <i class="fas fa-user-circle"></i>
                        </div>
                        <div class="msg-user-rest">
                            <div class="msg-user-name">{{msg.displayUserName}}</div>
                            <div class="msg-time">{{msg.displayTime}}</div>
                        </div>
                    </div>
                </template>
                <div class="msg-text">{{msg.text}}</div>
            </div>
        </div>
        <div class="msg-bottom-control">
            <b-form class="form" @submit.prevent>
                <b-form-group>
                    <b-form-input
                            ref="newMessageInput"
                            v-model.trim="newMessage"
                            placeholder="Write a reply"
                            v-on:keyup.enter="sendMessage"
                            autocomplete="off"
                    ></b-form-input>
                    <div class="msg-reply-icon-wrapper" @click.prevent="sendMessage">
                        <SvgIcon icon="email" :params="{ fill: '#8A877D' }"></SvgIcon>
                    </div>
                </b-form-group>
            </b-form>
        </div>
    </div>
</template>

<script>
import helpers from '../helpers';
import SvgIcon from './SvgIcon';
export default {
    name: "MessagesContent",
    components: {SvgIcon},
    props: ['idFrom', 'idTo', 'mealInfo'],
    data: () => ({
        messages: [],
        isLoaded: false,
        newMessage: '',
        tempMessages: [
            {
                id: 1,
                date: '2020-11-20T20:00:00:000Z',
                text: 'How spicy is the meal?',
                isCurrentUserMsg: true
            },
            {
                id: 2,
                date: '2020-11-21T07:20:00:000Z',
                text: `It's not super spicy, but...Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
                    sed vehicula massa, vitae semper ante.!`,
                fromName: 'Jimmy R.',
                from: {
                    firstName: 'Jimmy',
                    lastName: 'Rehan',
                    id: 10
                }
            },
            {
                id: 3,
                date: '2020-11-21T07:20:00:000Z',
                text: 'Let me know if you have more questions!',
                fromName: 'Jimmy R.',
                from: {
                    firstName: 'Jimmy',
                    lastName: 'Rehan',
                    id: 10
                }
            },
            {
                id: 4,
                date: '2020-11-21T17:00:00:000Z',
                text: 'Great thanks!',
                isCurrentUserMsg: true
            },
            {
                id: 5,
                date: '2020-11-22T07:00:00:000Z',
                text: 'No problem!',
                fromName: 'Jimmy R.',
                from: {
                    firstName: 'Jimmy',
                    lastName: 'Rehan',
                    id: 10
                }
            }
        ],
        isSendingMessage: false
    }),
    methods: {
        clearData () {
            this.messages = [];
            this.isLoaded = false;
            this.newMessage = false;
            this.isSendingMessage = false;
        },
        loadMessages () {
            // TODO: temp
            this.messages = this.tempMessages.map(msg => {
                const _data = { ...msg };
                _data['displayTime'] = this.displayTime(_data.date);
                // TODO: temp
                if (!_data.isCurrentUserMsg && _data.from) {
                    _data['displayUserName'] = this.displayUserName(_data.from);
                }
                return _data;
            });
            setTimeout(() => {
                this.isLoaded = true;
                this.scrollMessagesToBottom();
                this.$emit('on-loaded', this.messages);
            }, 1000);
        },
        displayTime (val) {
            return helpers.parseMessageDate(val);
        },
        displayUserName (userInfo) {
            return helpers.userNameWithShortLastName(userInfo);
        },
        sendMessage () {
            if (this.isSendingMessage || !this.newMessage || !this.newMessage.length) return;
            this.isSendingMessage = true;
            const _time = new Date();
            this.messages.push({
                id: _time.getTime(),
                displayTime: helpers.parseNewMessageDate(_time),
                text: this.newMessage,
                isCurrentUserMsg: true
            });
            this.scrollMessagesToBottom();
            this.newMessage = '';
            this.isSendingMessage = false;
            this.setFocusOnInput();
        },
        scrollMessagesToBottom () {
            this.$nextTick(() => {
                if (this.$refs.msgContent) {
                    const _ref = this.$refs.msgContent;
                    _ref.scrollTop = _ref.scrollHeight;
                }
            });
        },
        setFocusOnInput () {
            this.$nextTick(() => {
                if (this.$refs.newMessageInput) {
                    const _ref = this.$refs.newMessageInput;
                    if (_ref['focus']) {
                        _ref.focus();
                    }
                }
            });
        },
        redirectToOffer () {
            // TODO: send offer id via event below
            this.$emit('on-redirect-to-offer');
        }
    },
    created () {
        this.$eventHub.$on('clear-messages-content', () => {
            this.clearData();
        });
        this.loadMessages();
    },
    beforeDestroy () {
        this.$eventHub.$off('clear-messages-content');
    }
}
</script>

<style scoped lang="scss">
@import "../scss/utils/vars";
.msg-wrapper {
    margin-bottom: 20px;

    @media screen and (max-width: $phoneBigWidth) {
        margin-bottom: 10px;
    }

    .msg-header {
        display: flex;
        flex-direction: row;
        width: 100%;
        padding-left: 10px;
        padding-right: 10px;
        margin-bottom: 12px;

        .msg-line {
            height: 2px;
            min-width: 100px;
            background-color: #EEE8D7;
            flex: 1 1 auto;
            margin-top: 10px;
            margin-right: 20px;
        }
        .msg-meal-info-wrapper {
            display: flex;
            flex-direction: row;
            flex: 0 0 auto;
            max-width: 70%;
            flex-wrap: wrap;
            justify-content: flex-end;

            @media screen and (max-width: $phoneBigWidth) {
                flex-direction: column;
                align-items: flex-end;
            }

            p {
                color: $textBlackColor;
                font-family: $FilsonProRegular;
                font-size: 14px;
                letter-spacing: 0;
                line-height: 24px;

                &.msg-meal-link {
                    cursor: pointer;
                    font-family: $FilsonProBold;
                    color: $greenColor;
                    text-decoration: underline;
                    padding-left: 10px;

                    @media screen and (max-width: $phoneBigWidth) {
                        padding-left: 0;
                    }
                }
            }
        }
    }

    .msg-content {
        display: flex;
        flex-direction: column;
        max-height: 400px;
        overflow-y: auto;

        @media screen and (max-width: $phoneBigWidth) {
            max-height: 300px;
        }

        .msg-item {
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: calc(100% - 20px);
            margin-bottom: 9px;

            &:last-of-type {
                margin-bottom: 45px;
            }

            &:not(.your-msg) {
                align-self: flex-start;
                align-items: flex-start;
                margin-left: 10px;
                margin-right: 20px;

                .msg-text {
                    font-family: $FilsonProRegular;
                    font-size: 16px;
                    background-color: #FFFFFF;
                    color: $textBlackColor;
                    border-radius: 0 20px 20px 20px;
                    box-shadow: 0 4px 16px 0 rgba(69,53,38,0.15);
                    padding: 16px 16px 14px;

                    @media screen and (max-width: $phoneBigWidth) {
                        font-size: 14px;
                    }
                }
            }
            &.your-msg {
                align-self: flex-end;
                align-items: flex-end;
                margin-right: 10px;
                margin-left: 20px;

                .msg-text {
                    font-family: $FilsonProBold;
                    font-size: 18px;
                    background-color: $greenColor;
                    color: #FFFFFF;
                    border-radius: 20px 0 20px 20px;
                    padding: 9px 16px 7px 24px;

                    @media screen and (max-width: $phoneBigWidth) {
                        font-size: 14px;
                    }
                }
            }

            .msg-text {
                letter-spacing: 0;
                line-height: 24px;
            }
            .msg-time {
                color: $grayColor;
                font-family: $FilsonProRegular;
                font-size: 14px;
                letter-spacing: 0;
                line-height: 24px;
                margin-bottom: 8px;

                @media screen and (max-width: $phoneBigWidth) {
                    font-size: 12px;
                }
            }
            .msg-user-wrapper {
                display: flex;
                flex-direction: row;
                margin-bottom: 10px;
                align-items: flex-start;

                .msg-user-icon {
                    margin-right: 10px;

                    i {
                        font-size: 48px;
                        color: $grayColor;
                    }
                }
                .msg-user-rest {
                    padding-top: 4px;

                    .msg-user-name {
                        font-family: $FilsonProBold;
                        font-size: 16px;
                        letter-spacing: 0;
                        line-height: 24px;
                        color: $textBlackColor;

                        @media screen and (max-width: $phoneBigWidth) {
                            font-size: 14px;
                        }
                    }
                    .msg-time {
                        margin-bottom: 0;
                    }
                }
            }
        }
    }
    .msg-bottom-control {
        .form {
            padding-left: 10px;
            padding-right: 10px;

            .form-group {
                margin-bottom: 0;
                position: relative;

                .form-control {
                    padding-right: 70px;

                    @media screen and (max-width: $tableMinWidth) {
                        padding-right: 60px;
                    }
                }

                .msg-reply-icon-wrapper {
                    cursor: pointer;
                    position: absolute;
                    right: 0;
                    top: 0;
                    height: 65px;
                    width: 60px;

                    .svg-icon-wrapper {
                        position: relative;
                        top: 21px;
                        left: 14px;
                    }

                    @media screen and (max-width: $tableMinWidth) {
                        height: 48px;
                        width: 50px;

                        .svg-icon-wrapper {
                            top: 13px;
                            left: 10px;
                        }
                    }
                }
            }
        }
    }
}
</style>
