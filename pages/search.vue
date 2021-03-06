<template>
  <div class="search-page page-container page-container--fluid">

    <div class="search-page__field">
      <search-icon class="search-page__icon" />
      <v-text-field
        v-model="searchQuery"
        :loading="isLoading"
        class="search-page__input"
        color="brown"
        hide-details
        placeholder="Search for any image"
        @keyup.native="onKeywordChange"
      />
    </div>

    <div class="mt-20">
      <masonry-images-grid
        :colCount.sync="colCount"
        :images="images"
        @open-details="openDetails"
      />

      <no-ssr>
        <infinite-loading
          v-if="searchQuery.length"
          ref="infiniteLoading"
          @infinite="infiniteHandler"
        >
          <span slot="no-more" />
          <v-card
            slot="no-results"
            class="text-xs-center py-20"
          >
            No Result Found
          </v-card>
        </infinite-loading>
      </no-ssr>
    </div>

  </div>
</template>

<script>
import { mapActions } from 'vuex';
import InfiniteLoading from 'vue-infinite-loading';

import axios from '@/plugins/axios';

import MasonryImagesGrid, {
  mixin as masonryImagesGridMixin,
} from '~/components/MasonryImagesGrid';
import SearchIcon from '~/assets/icons/search.svg';

export default {
  components: {
    InfiniteLoading,
    MasonryImagesGrid,
    SearchIcon,
  },
  mixins: [masonryImagesGridMixin],
  data() {
    const { q, tags } = this.$route.query;

    let searchQuery = '';
    if (tags) {
      searchQuery = tags
        .split(',')
        .reduce((tagQuery, tag) => `${tagQuery}#${tag} `, '')
        .trim();
    } else if (q) {
      searchQuery = decodeURIComponent(q);
    }

    return {
      images: [],
      isLoading: false,
      pageInfo: null,
      rawImages: [],
      searchQuery,
      timer: null,
    };
  },
  head() {
    return {
      title: `${
        this.searchQuery ? `${this.searchQuery} - ` : ''
      }Search Images | puttyimages`,
    };
  },
  mounted() {
    if (this.searchQuery) {
      this.onKeywordChange();
    }
  },
  methods: {
    ...mapActions(['toggleImageDetailsDialog']),
    async infiniteHandler($state) {
      const { colCount, pageInfo, rawImages } = this;
      if (pageInfo && pageInfo.hasNextPage) {
        try {
          this.isLoading = true;
          const { data, pageInfo: nextPageInfo } = (await axios.get(
            pageInfo.next
          )).data;
          this.isLoading = false;
          this.rawImages = rawImages.concat(data);
          this.images = this.sortImagesByHeight(this.rawImages, colCount);
          this.pageInfo = nextPageInfo;
          $state.loaded();
        } catch (err) {
          this.isLoading = false;
        }
      } else {
        $state.complete();
      }
    },
    matchRouteToSearchQuery() {
      const nextRoute = {
        name: 'search',
        query: {},
      };

      if (this.searchQuery) {
        nextRoute.query.q = this.searchQuery;
      }

      // Replace route history if:
      // - there is no 'q' field in query string or;
      // - there are more than one fields
      if (!this.$route.query.q || Object.keys(this.$route.query).length > 1) {
        this.$router.replace(nextRoute);
      } else {
        this.$router.push(nextRoute);
      }
    },
    async onKeywordChange(e) {
      const { colCount, searchQuery } = this;
      if (searchQuery.length === 0) {
        this.isLoading = false;
        this.images = [];
        this.pageInfo = null;
        this.matchRouteToSearchQuery();
        return;
      } else if (e) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.onKeywordChange(), 300);
        return;
      }
      this.isLoading = true;
      try {
        const { data, pageInfo } = (await axios.get(
          `/api/search?q=${encodeURIComponent(searchQuery)}`
        )).data;
        this.isLoading = false;
        this.rawImages = data;
        this.images = this.sortImagesByHeight(data, colCount);
        this.pageInfo = pageInfo;
        const { stateChanger } = this.$refs.infiniteLoading;
        if (pageInfo.hasNextPage) {
          stateChanger.reset();
        } else {
          if (data.length) {
            stateChanger.loaded();
          }
          stateChanger.complete();
        }
        this.matchRouteToSearchQuery();
      } catch (err) {
        this.isLoading = false;
      }
    },
    openDetails(image, options) {
      this.toggleImageDetailsDialog({
        ...options,
        image,
        isFetched: true,
        isOpen: true,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/classes';

.application .search-page__input /deep/ .input-group__details:before {
  background-color: transparent;
}
.search-page__field {
  display: flex;
  align-items: center;

  @include desktop-and-up {
    width: 60%;
  }
  margin: 0 auto;
  padding: 0 16px;

  border-radius: 2px;
  background: #efefef;
}
.search-page__icon {
  width: 23px;
  height: 23px;

  color: #aaa;
}
.search-page__input {
  margin-left: 14px;
  padding: 14px 0;
}
.search-page__input /deep/ input::placeholder {
  text-align: center;
}
</style>
