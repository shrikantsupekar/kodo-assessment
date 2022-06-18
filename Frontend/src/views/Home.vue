<template>
  <div class="home">
    <div class="top-bar">
      <div>
        <input v-model="query" type="search" placeholder="search" />
      </div>
      <div>
        <label>Sort By </label>
        <select v-model="sortBy">
          <option value="">Select</option>
          <option value="name">Name</option>
          <option value="dateLastEdited">Date Last Edited</option>
        </select>
      </div>
    </div>
    <div class="grid">
      <div class="col" :key="post.name" v-for="post in posts">
        <post :post="post" />
      </div>
    </div>
    <div class="table">
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>DateLastEdited</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr :key="post.name" v-for="post in posts">
            <td>
              <img :src="post.image" onerror="this.src='default.png'" />
            </td>
            <td>
              {{ post.name }}
            </td>
            <td>
              {{ post.dateLastEdited | date }}
            </td>
            <td>
              {{ post.description }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <div></div>
      <div class="buttons">
        <button :disabled="!(page > 1)" @click="page--">Prev</button>
        <span>{{ page }}</span>
        <button :disabled="!(page < total / 10)" @click="page++">Next</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.grid {
  display: grid;
  gap: 12px 12px;
}
.table {
  margin-top: 50px;
}
table {
  border: 1px solid gray;
  border-collapse: collapse;
}
table tr {
  border-bottom: 1px solid silver;
}
td img {
  width: 100px;
  height: 100px;
  max-height: 100px;
  object-fit: contain;
}
td,
th {
  border-right: 1px solid silver;
}
/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  .grid {
    grid-template-columns: auto;
  }
  td:first-child,
  th:first-child {
    display: none;
  }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
  .grid {
    grid-template-columns: auto;
  }
  td:first-child,
  th:first-child {
    display: none;
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
  .grid {
    grid-template-columns: auto auto;
  }
  td:first-child,
  th:first-child {
    display: none;
  }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  .grid {
    grid-template-columns: auto auto auto;
  }
  td:first-child,
  th:first-child {
    display: table-cell;
  }
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
  .grid {
    grid-template-columns: auto auto auto;
  }
  td:first-child,
  th:first-child {
    display: table-cell;
  }
}

.top-bar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
  padding-bottom: 12px;
}
.top-bar div {
  width: 50%;
}
.top-bar div:first-child {
  text-align: left;
}
.top-bar div:last-child {
  text-align: right;
}
.top-bar input {
  width: 300px;
  max-width: 100%;
}

.pagination {
  margin-top: 50px;
  margin-bottom: 50px;
  display: flex;
  justify-content: space-between;
}
.pagination button {
  padding: 12px;
  background: blue;
  color: white;
  margin-right: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.pagination button:disabled {
  cursor: crosshair !important;
  opacity: 0.5 !important;
}
.pagination .buttons span {
  padding: 12px;
  margin-right: 12px;
}
</style>
<script lang="ts">
import Vue from "vue";
import axios from "axios";
import post from "../components/Post.vue";
import { Post } from "../types";

export default Vue.extend({
  components: { post },
  filters: {
    date(v: string): string {
      return new Date(v).toLocaleString();
    },
  },
  data() {
    return {
      posts: [] as Array<Post>,
      query: "" as string,
      page: 1 as number,
      sortBy: "" as string,
      total: 0 as number,
      initialized: false,
    };
  },
  async created() {
    this.page = (parseInt(this.$route.query.page as string) || 1) as number;
    this.query = (this.$route.query.query || "") as string;
    this.sortBy = (this.$route.query.sortBy || "") as string;

    await this.loadPosts();

    this.initialized = true;
  },
  watch: {
    query() {
      if (this.initialized) {
        this.page = 1;

        if (this.page.toString() === this.$route.query.page) this.loadPosts();
      }
    },
    sortBy() {
      if (this.initialized) {
        this.page = 1;

        if (this.page.toString() === this.$route.query.page) this.loadPosts();
      }
    },
    page() {
      if (this.initialized) this.loadPosts();
    },
  },
  methods: {
    async loadPosts() {
      await axios
        .get("http://localhost:3000", {
          params: {
            page: this.page,
            query: this.query,
            sortBy: this.sortBy || null,
          },
        })
        .then((res) => {
          this.posts = res.data.posts;
          this.total = res.data.total;
        });

      const routeQuery: { page: string; query?: string; sortBy?: string } = {
        page: this.page.toString(),
      };
      if (this.query) routeQuery.query = this.query;

      if (this.sortBy) routeQuery.sortBy = this.sortBy;

      if (
        routeQuery.page !== this.$route.query.page ||
        routeQuery.query !== this.$route.query.query ||
        routeQuery.sortBy !== this.$route.query.sortBy
      )
        this.$router.replace({
          name: "Home",
          query: routeQuery,
        });
    },
  },
});
</script>
