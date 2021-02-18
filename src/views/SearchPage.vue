<template>
    <div class="dashboard-content search-page">
        <div class="container-fluid position-relative">
            <loading
                    :active.sync="isLoading"
                    :is-full-page="loaderOptions.IS_FULL_PAGE"
                    :color="loaderOptions.COLOR"
                    :background-color="loaderOptions.BACKGROUND_COLOR"
            ></loading>
            <div class="row pad-70b">
                <div class="col-12 text-center">
                    <template v-if="queryName && queryName.length && !wasSearched">
                        <div class="title-size3 titleDarkColor mb-3">Results for</div>
                        <h1 class="title-size1 titleDarkColor">“{{queryName}}”</h1>
                    </template>
                    <template v-else-if="wasSearched && !isLoading && results && results.length">
                        <div class="title-size3 titleDarkColor mb-3">
                            {{results.length}} Result{{results.length === 1 ? '' : 's'}} for
                        </div>
                        <h1 class="title-size1 titleDarkColor" v-if="searchStr">“{{searchStr}}”</h1>
                    </template>
                    <template v-else-if="wasSearched && !isLoading && (!results || !results.length)">
                        <div class="title-size3 titleDarkColor mb-3">No results for</div>
                        <h1 class="title-size1 titleDarkColor" v-if="searchStr">“{{searchStr}}”</h1>
                    </template>
                </div>
            </div>

            <MainSearch
                    @search-started="onSearchStarted"
                    @search-finished="onSearchFinished"
            ></MainSearch>
        </div>
    </div>
</template>

<script>
import SearchFilters from '../components/SearchFilters';
import Loading from 'vue-loading-overlay';
import MainSearch from '../components/MainSearch';
import config from "../config";
export default {
    name: "SearchPage",
    components: {SearchFilters, Loading, MainSearch},
    data: () => ({
        queryName: '',
        searchStr: '',
        isLoading: false,
        results: [],
        loaderOptions: { ...config.LOADER_OPTIONS },
        wasSearched: false
    }),
    beforeRouteEnter (to, from, next) {
        next(vm => {
            const { name = '' } = to.query;
            vm.queryName = name;
            vm.initPage();
        });
    },
    beforeRouteUpdate (to, from, next) {
        const { name = '' } = to.query;
        this.queryName = name;
        this.initPage(next);
    },
    methods: {
        clearPageData () {
            this.searchStr = '';
            this.results = [];
            this.isLoading = false;
            this.wasSearched = false;
        },
        initPage (cb) {
            this.$eventHub.$emit('clear-global-search-value');
            this.clearPageData();
            if (this.queryName && this.queryName.length) {
                this.searchStr = this.queryName;
            }
            this.$eventHub.$emit('trigger-main-search', this.searchStr, cb);
        },
        onSearchStarted (searchStr) {
            this.isLoading = true;
            this.results = [];
            this.searchStr = searchStr;
        },
        onSearchFinished (results, searchStr) {
            this.isLoading = false;
            this.wasSearched = true;
            this.results = results;
            this.searchStr = searchStr;
        }
    }
}
</script>

<style scoped lang="scss">
.search-page {
    &.dashboard-content {
        padding-bottom: 0 !important;
    }
}
</style>
