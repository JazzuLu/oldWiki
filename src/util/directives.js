import Vue from 'vue'
import infiniteScroll from './plugins/infiniteScroll'
require('./plugins/Tdrag')

/** v-dialogDrag: 弹窗拖拽  http://www.jq22.com/jquery-info8362 **/
Vue.directive('dialogDrag', {
  bind(el, binding, vnode, oldVnode) {

    let handlerClass = binding.value.handlerClass ? '.' + binding.value.handlerClass : null;
    let scopeClass = binding.value.scopeClass ? '.' + binding.value.scopeClass : null;
    // console.log('dialogHeaderEl',handlerClass,$(el));

    $(el).Tdrag({
      handle: handlerClass,
      scope: scopeClass,
      cbEnd:function(){
        binding.value.cbEnd && binding.value.cbEnd(el,binding.value);
      },
    });

    /** 使用设置 **/
    /*let call = {
      scope: null,//父级
      grid: null,//网格
      axis:"all",//上下或者左右
      pos:false,//是否记住位置
      handle:null,//手柄
      moveClass:"tezml",//移动时不换位加的class
      dragChange:false,//是否开启拖拽换位
      changeMode:"point",//point & sort
      cbStart:function(){},//移动前的回调函数
      cbMove:function(){},//移动中的回调函数
      cbEnd:function(){},//移动结束时候的回调函数
      random:false,//是否自动随机排序
      randomInput:null,//点击随机排序的按钮
      animation_options:{//运动时的参数
        duration:800,//每次运动的时间
        easing:"ease-out"//移动时的特效，ease-out、ease-in、linear
      },
      disable:false,//禁止拖拽
      disableInput:null//禁止拖拽的按钮
    };*/

  }
});

/** v-dragResize: 弹窗拖大 拖小  详情见 https://api.jqueryui.com/resizable/#event-resize **/
Vue.directive('dragResize', {
  bind(el, binding, vnode, oldVnode) {
    $(el).resizable({
      resize: function(e,ui) {
        if (binding.expression) {
          // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
          typeof binding.value == 'object' && binding.value.resize ? binding.value.resize(e,ui,binding.value) : '';
          typeof binding.value == 'function' ? binding.value(e,ui,binding.value) : '';
        }
        // console.log('弹窗拖大 拖小',e)
      },
      stop(e,ui){
        if (binding.expression) {
          // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
          typeof binding.value == 'object' && binding.value.stop ? binding.value.stop(e,ui,binding.value) : '';
        }
      }
    });
  }
});

/** v-contentMenu: 右键菜单  详情见 https://api.jqueryui.com/resizable/#event-resize **/
Vue.directive('contentMenu', {
  bind(el, binding, vnode, oldVnode) {
    let delegate = binding.value.delegate || el;
    let menu = binding.value.menu;
    if(binding.value){
      $(el).contextmenu({
        delegate:delegate,
        select: function(key, options) {
          // console.log(key, options)
          typeof binding.value.select == 'function' ? binding.value.select(key, options, binding.value) : '';
        },
        beforeOpen: function (event, ui) {
          // console.log('beforeOpen',event, ui)
          typeof binding.value.beforeOpen == 'function' ? binding.value.beforeOpen(event, ui, binding.value) : '';
        },
        menu: menu
      });
    }
  }
});



/** v-tapOutside: 点击其他地方隐藏 **/
Vue.directive('tapOutside', {
  bind(el, binding, vnode) {
    function documentHandler(e) {
      // 这里判断点击的元素是否是本身，是本身，则返回
      if (el.contains(e.target)) {
        return false;
      }
      // 判断指令中是否绑定了函数
      if (binding.expression) {
        // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
        binding.value(e);
      }
    }
    // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
    el.__vueClickOutside__ = documentHandler;
    document.addEventListener('click', documentHandler);
  },
  unbind(el, binding) {
    // 解除事件监听
    document.removeEventListener('click', el.__vueClickOutside__);
    delete el.__vueClickOutside__;
  },
});

/** v-infiniteScroll: 滚动加载更多 详情见 https://www.jianshu.com/p/c4abab8c1ba6 **/
Vue.directive('infiniteScroll', {
  bind(el, binding, vnode) {
    infiniteScroll.bind(el, binding, vnode)
  },
  update(el, binding, vnode) {
    infiniteScroll.bind(el, binding, vnode)
  },
  unbind(el, binding, vnode) {
    // 解除事件监听
    infiniteScroll.unbind(el, binding, vnode)
  },
});

/** v-loadmore: 滚动到底部触发用户指定事件 **/
Vue.directive('loadmore', {
  bind(el, binding) {
    console.log(binding)
    const SELECTWRAP_DOM = binding.value.document ? $(document)[0] : el;

    SELECTWRAP_DOM.addEventListener('scroll', function() {

      /**
    * scrollHeight 获取元素内容高度(只读)
    * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
    * clientHeight 读取元素的可见高度(只读)
    * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
    * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
    */
      const CONDITION = this.scrollHeight - this.scrollTop <= this.clientHeight;

      console.log('CONDITION',CONDITION,this.scrollHeight,this)

      if(CONDITION) {
        binding.value.fn && binding.value.fn();
      }
    });
  }
});


/** v-intervalclick: 使用方法 v-intervalclick = {func:执行方法,time:间隔时间(毫秒数),...执行方法所需要的参数} **/
let openDelay=false;
Vue.directive('intervalclick', function(el,binding){
  el.onclick=function(e){
    if(binding.value.stop) e.stopPropagation();

    if(openDelay)return;
    openDelay=!openDelay;
    if (!binding.value) {
      alert("未传入Value数据！");
      return;
    }
    let func = binding.value['func'];
    let time=binding.value['time'];
    if(typeof time !=='number'){
      alert("传入等待时间错误");
      return;
    }
    let args=[];
    for (const key in binding.value) {
      if (binding.value.hasOwnProperty(key)) {
        if(key==='func'||key==='time'||key==='stop')continue;
        args.push(binding.value[key])
      }
    }
    setTimeout(() => {
      openDelay=!openDelay;
    }, time);
    func(...args);
  }
})


/** v-fixAxis: 修正悬浮窗的坐标 ----   注：目前只做了 y 坐标 **/
Vue.directive('fixAxis', {
  bind(el, binding) {
    // console.log('修正悬浮窗的坐标',el, binding)
    if(binding.value.y!==undefined && Number(binding.value.y)){
      let top = binding.value.y + $(el).height() > $(window).height() ? $(window).height()-$(el).height()-10 : binding.value.y;
      $(el).css({top:top+'px'})
    }
  }
});


/** v-showTitle: 出现 ... 之后才显示 title 不要给父级元素使用 否则会出错 **/
Vue.directive('showTitle', {
  update(el, binding, vnode){
    let text = binding.value || $(el).text();
    $(el).unbind('mouseenter mouseleave').mouseenter(function () {
      // $(el).parent().append(`<span class="bbx_show_title_none" style="display:none;">${text}</span>`);
      $(el).clone().addClass('bbx_show_title_none').css({display:'block',left:'-100000px',width:'auto',position:'fixed',textOverflow:'initial'}).insertAfter($(el));
      let realWidth = $('.bbx_show_title_none').width();
      if($(el).width() < realWidth){
        $(el).attr('title',text)
      }else{
        $(el).removeAttr('title')
      }
    }).mouseleave(function () {
      $('.bbx_show_title_none').remove();
    })
  },
});
