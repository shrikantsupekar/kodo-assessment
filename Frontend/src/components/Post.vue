<template>
  <div class="card">
    <div class="head">
      <img :src="post.image" onerror="this.src='default.png'" />
    </div>
    <div class="body">
      <div class="title">{{ post.name }}</div>
      <div>
        <small class="date"> {{ post.dateLastEdited | date }} </small>
      </div>
      <div class="description">{{ post.description }}</div>
    </div>
  </div>
</template>
<style scoped>
.card {
  border: 1px solid silver;
  border-radius: 5px;
  box-shadow: 0 3px 3px 3px rgba(0, 0, 0, 0.2), 0 3px 3px 0 rgba(0, 0, 0, 0.14),
    0 3px 3px 0 rgba(0, 0, 0, 0.12) !important;
}
.head {
  width: 100%;
  height: 200px;
}
.head img {
  width: 100%;
  height: 100%;
  max-height: 100%;
  object-fit: contain;
}
.body {
  padding: 12px;
  text-align: left;
}
.title {
  font-weight: bold;
}
.date {
  color: gray;
}
</style>
<script lang="ts">
import Vue from "vue";
import { Post } from "../types";

export default Vue.extend({
  filters: {
    date(v: string): string {
      return new Date(v).toLocaleString();
    },
  },
  props: {
    post: Object as () => Post,
  },
  data() {
    return {};
  },
});
</script>
