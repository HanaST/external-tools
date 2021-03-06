//>>built
define("gridx/modules/VirtualVScroller",["dojo/_base/declare","dojo/_base/lang","dojo/_base/array","dojo/_base/sniff","dojo/_base/event","dojo/_base/Deferred","dojo/query","dojo/keys","./VScroller","../core/_Module"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a){
return _1(_9,{constructor:function(_b,_c){
if(_b.autoHeight){
_2.mixin(this,new _9(_b,_c));
}else{
this._scrolls=[];
}
},destroy:function(){
this.inherited(arguments);
clearTimeout(this._lazyScrollHandle);
clearTimeout(this._pVirtual);
},buffSize:5,lazy:false,lazyTimeout:50,scrollToRow:function(_d,_e){
var d=new _6(),t=this,s=t._scrolls,f=function(){
t._subScrollToRow(_d,d,_e);
};
s.push(d);
t._lazy=t.arg("lazy");
t.lazy=false;
if(s.length>1){
s[s.length-2].then(f);
}else{
f();
}
return d;
},_subScrollToRow:function(_f,_10,_11){
var t=this,dif=0,_12=t._avgRowHeight,bn=t.grid.bodyNode,dn=t.domNode,bst=bn.scrollTop,dst=dn.scrollTop,_13=_7("[visualindex=\""+_f+"\"]",bn)[0],_14=t.grid.focus,_15=function(_16){
t._scrolls.splice(_3.indexOf(t._scrolls,_10),1);
if(_14&&_14.currentArea()=="body"){
_14.focusArea("body",1);
}
t.lazy=t._lazy;
setTimeout(function(){
_10.callback(_16);
},5);
};
if(_13){
var _17=_13.offsetTop;
if(_17+_13.offsetHeight>bst+bn.clientHeight){
dif=_17-bst;
if(!_11){
dif+=_13.offsetHeight-bn.clientHeight;
}
}else{
if(_17<bst||(_11&&_17>bst)){
dif=_17-bst;
}else{
_15(true);
return;
}
}
}else{
if(bn.childNodes.length){
var n=bn.firstChild;
while(n&&n.offsetTop<bst){
n=n.nextSibling;
}
var idx=n&&n.getAttribute("visualindex");
if(n&&_f<idx){
dif=(_f-idx)*_12;
}else{
n=bn.lastChild;
while(n&&n.offsetTop+n.offsetHeight>bst+bn.clientHeight){
n=n.previousSibling;
}
idx=n&&n.getAttribute("visualindex");
if(n&&_f>idx){
dif=(_f-idx)*_12;
}else{
_15(false);
return;
}
}
}else{
_15(false);
return;
}
}
var _18=dst===0&&dif<0,_19=dst>=dn.scrollHeight-dn.offsetHeight&&dif>0;
if(_18||_19){
t._doVirtualScroll(1);
}else{
dn.scrollTop+=dif/t._ratio;
}
if((_18&&bn.firstChild.getAttribute("visualindex")==0)||(_19&&bn.lastChild.getAttribute("visualindex")==t.grid.body.visualCount-1)){
_15(false);
return;
}
setTimeout(function(){
t._subScrollToRow(_f,_10,_11);
},5);
},_init:function(_1a){
var t=this;
t._rowHeight={};
t._syncHeight();
t.connect(t.grid,"_onResizeEnd",function(){
t._doScroll(0,1);
});
t._doScroll(0,1);
},_doVirtualScroll:function(_1b){
var t=this,dn=t.domNode,a=dn.scrollTop,_1c=t._ratio*(a-(t._lastScrollTop||0));
if(_1b||_1c){
t._lastScrollTop=a;
var _1d=t.arg("buffSize"),_1e=dn.scrollHeight-dn.offsetHeight,_1f=t.grid.body,_20=_1f.visualStart,_21=_20+_1f.visualCount,bn=t.grid.bodyNode,_22=bn.firstChild,_23=_22&&_22.offsetTop-_1c,_24=bn.lastChild,_25=_24&&_24.offsetTop-_1c+_24.offsetHeight,_26=bn.scrollTop,_27=_26+bn.clientHeight,h=t._avgRowHeight,_28=Math.ceil(dn.offsetHeight/h)+2*_1d,_29,end,pos,d;
if(_26==_27&&!_27){
return;
}
if(_22&&_23>_26&&_23<_27){
end=_1f.renderStart;
d=Math.ceil((_23-_26)/h)+_1d;
_29=a===0?_20:Math.max(end-d,_20);
pos="top";
}else{
if(_24&&_25>_26&&_25<_27){
_29=_1f.renderStart+_1f.renderCount;
d=Math.ceil((_27-_25)/h)+_1d;
end=a===_1e&&a?_21:Math.min(_29+d,_21);
pos="bottom";
}else{
if(!_22||_23>_27||!_24||_25<_26){
if(a<=_1e/2){
_29=a===0?_20:_20+Math.max(Math.floor(a/h)-_1d,0);
end=Math.min(_29+_28,_21);
}else{
end=a===_1e?_21:_21+Math.min(_28-Math.floor((_1e-a)/h),0);
_29=Math.max(end-_28,_20);
}
pos="clear";
}else{
if(_22){
if(a===0){
var _2a=_1f.renderStart;
if(_2a>_20){
_29=_20;
end=_2a;
pos="top";
}
}else{
if(a===_1e){
var _2b=_1f.renderStart+_1f.renderCount-1;
if(_2b<_21-1){
_29=_2b+1;
end=_21;
pos="bottom";
}
}
}
}
}
}
}
if(typeof _29=="number"&&typeof end=="number"){
_1f.renderRows(_29,end-_29,pos);
if(a&&_29<end){
var n=_7("[visualindex=\""+end+"\"]",bn)[0];
if(n){
_1c+=n.offsetTop;
}
}
}
if(a===0){
bn.scrollTop=0;
}else{
if(a>=_1e){
bn.scrollTop=bn.scrollHeight;
}else{
if(pos!="clear"){
bn.scrollTop+=_1c;
}
}
}
}
},_doScroll:function(e,_2c){
var t=this;
if(t.arg("lazy")){
if(t._lazyScrollHandle){
clearTimeout(t._lazyScrollHandle);
}
t._lazyScrollHandle=setTimeout(_2.hitch(t,t._doVirtualScroll,_2c),t.arg("lazyTimeout"));
}else{
t._doVirtualScroll(_2c);
}
},_onMouseWheel:function(e){
if(this.grid.vScrollerNode.style.display!="none"){
var _2d=typeof e.wheelDelta==="number"?e.wheelDelta/3:(-40*e.detail);
this.domNode.scrollTop-=_2d/this._ratio;
_5.stop(e);
}
},_onBodyChange:function(){
this._update();
this._doScroll(0,1);
this._doVirtual();
},_onForcedScroll:function(){
this._rowHeight={};
this._doScroll(0,1);
this._doVirtual();
},_avgRowHeight:24,_rowHeight:null,_ratio:1,_syncHeight:function(){
var t=this,h=t._avgRowHeight*t.grid.body.visualCount,_2e=1342177;
if(_4("ff")){
_2e=17895697;
}else{
if(_4("webkit")){
_2e=134217726;
}
}
if(h>_2e){
t._ratio=h/_2e;
h=_2e;
}
t.stubNode.style.height=h+"px";
},_doVirtual:function(){
var t=this;
clearTimeout(t._pVirtual);
t._pVirtual=setTimeout(function(){
t._updateRowHeight();
},100);
},_updateRowHeight:function(){
var t=this,_2f=0,_30=0,g=t.grid,bd=g.body,bn=g.bodyNode,_31=t.buffSize*t._avgRowHeight,st=bn.scrollTop,top=st-_31,_32=st+bn.clientHeight+_31,rh=t._rowHeight;
_3.forEach(bn.childNodes,function(n){
rh[n.getAttribute("rowid")]=n.offsetHeight;
if(n.offsetTop>_32){
++_30;
}else{
if(n.offsetTop+n.offsetHeight<top){
++_2f;
}
}
});
bd.unrenderRows(_2f);
bd.unrenderRows(_30,"post");
var p,h=0,c=0;
for(p in rh){
h+=rh[p];
++c;
}
if(c){
t._avgRowHeight=h/c;
t._syncHeight();
}
},_onKeyScroll:function(evt){
var t=this,bd=t.grid.body,_33=t.grid.focus,sn=t.domNode,st="scrollTop",r,fc="_focusCellRow";
if(!_33||_33.currentArea()=="body"){
if(evt.keyCode==_8.HOME){
bd[fc]=0;
sn[st]=0;
}else{
if(evt.keyCode==_8.END){
bd[fc]=bd.visualCount-1;
sn[st]=t.stubNode.clientHeight-bd.domNode.offsetHeight;
}else{
if(evt.keyCode==_8.PAGE_UP){
r=bd[fc]=Math.max(bd.renderStart-bd.renderCount,0);
t.scrollToRow(r);
}else{
if(evt.keyCode==_8.PAGE_DOWN){
r=bd[fc]=Math.min(bd.visualCount-1,bd.renderStart+bd.renderCount);
t.scrollToRow(r,1);
}else{
return;
}
}
}
}
_5.stop(evt);
}
}});
});
