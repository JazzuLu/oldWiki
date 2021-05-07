import {base_url} from "@/util/const";


//获取 menu 配置信息
const url_get_main_menu = base_url + '/getmenu';   // 获取顶部菜单
const url_sequence_menu = base_url + '/sequence';   // 文章排序

const url_artcle_log = base_url + '/getlog';   // 文章历史记录
const url_search_content = base_url + '/search_content';   // 搜索文章

const url_version = base_url + '/get-version';   // 文章版本
const url_copycontent = base_url + '/copycontent';   // 复制文章到其他版本
const url_category_allcontent = base_url + '/getallcontent';   // 获取该类别下的所有文章


const url_post_login = base_url + '/login';        // 登录接口
const url_post_update_content = base_url + '/upcontent';  // 修改/增加/删除 一条文章
const url_get_content_list = base_url + '/getcontentlist';   // 获取文章列表
const url_get_content = base_url + '/getcontent';   // 根;据 id 获取文章详情
const url_post_upload = base_url + '/upload';   // 上传图片接口

/** 用户组 **/
const url_group_list = base_url + '/grouplist';
const url_save_group = base_url + '/savegroup'; //{id,group_name,user_list,cate_list}
const url_group_detail = base_url + '/groupdetail';
const url_user_list = base_url + '/userlist';




export {
  url_get_main_menu,
  url_sequence_menu,
  url_post_login,
  url_post_update_content,
  url_get_content_list,
  url_get_content,
  url_post_upload,
  url_artcle_log,
  url_search_content,
  url_version,
  url_copycontent,
  url_category_allcontent,

  url_group_list,
  url_save_group,
  url_group_detail,
  url_user_list,
}

