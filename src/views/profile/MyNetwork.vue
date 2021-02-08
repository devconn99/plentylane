<template>
    <div class="row">
        <div class="col-12">
            <div class="dashboard-title-box flex-row align-items-center mb-4 mb-lg-5 mt-2 mt-lg-3">
                <div class="dashboard-profile-title-back mr-2 mr-md-3">
                    <div class="cursor-pointer" @click="showMobileAside">
                        <SvgIcon icon="arrowLeft"></SvgIcon>
                    </div>
                </div>
                <div class="dashboard-profile-title-text title-size3 titleGreenNavyColor">My Network</div>
            </div>

            <b-tabs nav-class="custom-tabs" content-class="profile-item mt-4" v-model="activeTabIndex">
                <b-tab title="My Connections">
                    <b-form class="form searchFormNormal">
                        <b-form-group>
                            <b-form-input
                                    v-model="searchStrMyNetwork"
                                    placeholder="Search my connections"
                                    class="form-control"
                                    autocomplete="off"
                                    debounce="500"
                                    @update="onMyNtwSearchUpdate"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-form>
                    <div class="connection" v-if="myNetworkFiltered && myNetworkFiltered.length">
                        <div class="connection-box" v-for="item in myNetworkFiltered">
                            <div class="connection-box-info">
                                <div class="connection-box-info-img mr-2 mr-xl-3">
                                    <img :src="item.img" alt="" class="img-fluid">
                                </div>
                                <div class="connection-box-info-name">{{item.name}}</div>
                            </div>
                            <div class="box-btn">
                                <b-btn
                                        class="btnNavyRedTransparent btnSmallSize hover-slide-left"
                                        @click="removeItemFromMyNetwork(item.id)">
                                    <span>Remove</span>
                                </b-btn>
                            </div>
                        </div>
                    </div>
                </b-tab>
                <b-tab title="Invites">
                    <div class="invite"></div>
                </b-tab>
                <b-tab title="Everybody">
                    <div class="everybody"></div>
                </b-tab>
            </b-tabs>
        </div>

        <!-- Modals -->
        <ConfirmModal
                :id="modalId"
                :message="confirmRemoveMsg"
                @confirmed="onConfirmedRemove"
                @canceled="onCanceledRemove"
        ></ConfirmModal>
    </div>
</template>

<script>
import Loading from 'vue-loading-overlay';
import api from '../../api';
import ConfirmModal from '../../components/modals/ConfirmModal';
import config from "../../config";
import SvgIcon from '../../components/SvgIcon';
export default {
    name: "MyNetwork",
    components: {Loading, ConfirmModal, SvgIcon},
    data: () => ({
        loaderOptions: { ...config.LOADER_OPTIONS },
        isLoading: false,
        myNetwork: [],
        myNetworkFiltered: [],
        activeTabIndex: 0,
        confirmRemoveMsg: 'Are you sure you want to remove this person from your network?',
        idToRemove: '',
        modalId: 'confirm-remove',
        searchStrMyNetwork: ''
    }),
    created () {
        this.loadTabData(this.activeTabIndex);
    },
    methods: {
        loadTabData (tabIndex) {
            switch (tabIndex) {
                case 0:
                    if (!this.myNetwork || !this.myNetwork.length) {
                        this.getMyNetworkData();
                    }
                    break;
                case 1:
                    break;
                case 2:
                    break;
                default:
                    break;
            }
        },
        getMyNetworkData () {
            this.isLoading = true;
            api.dashboard.network.getMyNetwork()
                .then(result => {
                    if (result && result.length) {
                        this.myNetwork = result;
                        this.myNetworkFiltered = this.myNetwork.slice(0);
                    } else {
                        this.myNetwork = [];
                        this.myNetworkFiltered = [];
                    }
                    this.isLoading = false;
                })
                .catch(err => {
                    this.myNetwork = [];
                    this.myNetworkFiltered = [];
                    this.isLoading = false;
                })
        },
        removeItemFromMyNetwork (id) {
            this.idToRemove = id;
            this.$bvModal.show(this.modalId);
        },
        onConfirmedRemove () {
            if (this.idToRemove) {
                this.myNetwork = this.myNetwork.filter(item => item.id !== Number(this.idToRemove));
                if (this.myNetworkFiltered && this.myNetworkFiltered.length) {
                    this.myNetworkFiltered = this.myNetworkFiltered.filter(item => item.id !== Number(this.idToRemove));
                }
                this.idToRemove = '';
            }
        },
        onCanceledRemove () {
            this.idToRemove = '';
        },
        onMyNtwSearchUpdate () {
            this.filterMyNetwork();
        },
        filterMyNetwork () {
            if (!this.searchStrMyNetwork || !this.searchStrMyNetwork.length) {
                if (!this.myNetwork || !this.myNetwork.length) {
                    this.myNetworkFiltered = [];
                    return;
                }
                this.myNetworkFiltered = this.myNetwork.slice(0);
                return;
            }
            this.searchStrMyNetwork.trim();
            this.myNetworkFiltered = this.myNetwork.filter(item => {
                return item.name.toLowerCase().includes(this.searchStrMyNetwork);
            });
        },
        showMobileAside () {
            this.$eventHub.$emit('show-mobile-profile-aside');
        }
    }
}
</script>

<style scoped lang="scss">
@import "../../scss/utils/vars";
.connection {
    .connection-box {
        padding: 11px 0;
        border-bottom: 1px solid rgba(138,135,125,0.25);
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        .connection-box-info {
            display: flex;
            flex-direction: row;
            align-items: center;
            flex: none;
            .connection-box-info-img img {
                width: 40px;
                height: 40px;
                object-fit: cover;
            }
            .connection-box-info-name {
                font-family: $FilsonProBold;
            }
        }
    }
}

.profile-item {
    margin-bottom: -4px;
    margin-right: 24px;

    &:last-child {
        margin-right: 0;
    }
}
</style>
