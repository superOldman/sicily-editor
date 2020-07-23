// 导航的文字显示
const MODULES_INFO = [
  {
    name: '主页',
    icon: 'el-icon-s-home',
    router: 'home',
    navShow: true

  },
  {
    name: '编辑',
    icon: 'el-icon-tickets',
    router: 'editor',
    navShow: true

  },
  {
    name: '文章列表',
    icon: 'el-icon-coin',
    router: 'articleList',
    navShow: true
  },
  {
    name: '文件夹管理',
    icon: 'el-icon-folder-add',
    router: 'createFolder',
    navShow: true
  },
  {
    name: '图片管理',
    icon: 'el-icon-picture-outline',
    router: 'pictureList',
    navShow: true
  },
  {
    name: '用户详情',
    icon: 'el-icon-user-solid',
    router: 'userDetails',
    navShow: false
  },
];
export default MODULES_INFO