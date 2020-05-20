<template>
  <el-pagination
    v-if="listData.length"
    :current-page="currentPage"
    :page-size="10"
    layout="total, prev, pager, next  "
    :total="listData.length"
  ></el-pagination>
</template>