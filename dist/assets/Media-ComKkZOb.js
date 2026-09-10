import{_ as K,D as J,x as Q,j as oe,s as f,o as b,A as L,v as p,a as n,p as i,g as y,c as _,F as w,r as V,t as k,q as O,n as G,u as g,P as ne,I as ie,T as re,J as de,b as B,k as ce,f as H,K as pe,B as ue,M as ge,G as E}from"./index-C1psMr8V.js";import{a as ve}from"./mediaAnalytics-BWuWSvJx.js";import{M as me}from"./MediaGrid-sYtxwUOB.js";import"./index-D0zmi86e.js";import"./EmptyState-BrVTatwf.js";function q(v){if(!v)return"";const l=new Date(v);return Number.isNaN(l.getTime())?"":`${l.getFullYear()}-${String(l.getMonth()+1).padStart(2,"0")}-${String(l.getDate()).padStart(2,"0")} ${String(l.getHours()).padStart(2,"0")}:${String(l.getMinutes()).padStart(2,"0")}`}function fe(v){const l=String(v??"");return/[",\n]/.test(l)?`"${l.replace(/"/g,'""')}"`:l}function U(v){if(!Number.isFinite(v)||v<=0)return"0 B";const l=["B","KB","MB","GB","TB"];let c=0,a=v;for(;a>=1024&&c<l.length-1;)a/=1024,c+=1;return`${a>=100?Math.round(a):a.toFixed(1)} ${l[c]}`}function be(v){if(!Number.isFinite(v)||v<=0)return"";const l=Math.floor(v/3600),c=Math.floor(v%3600/60),a=Math.floor(v%60);return l?`${l}h ${c}m`:c?`${c}m ${a}s`:`${a}s`}function W(v,l,c){const a=new Blob([l],{type:c}),e=URL.createObjectURL(a),o=document.createElement("a");o.href=e,o.download=v,o.click(),setTimeout(()=>URL.revokeObjectURL(e),4e3)}const I=()=>new Date().toISOString().slice(0,10);function j(v){return String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function he(v,l=`media-export-${I()}.csv`){const c=["文件名","类型","格式","大小","路径","修改时间","拍摄时间","分辨率","设备","镜头","焦段","ISO","光圈","快门","GPS","评分","收藏","色彩标签","标签","AI状态"],a=v.map(o=>[o.name,o.type==="video"?"视频":"图片",o.format||(o.name||"").split(".").pop(),o.size!=null?U(o.size):o.sizeMB!=null?o.sizeMB+" MB":"",o.path||"",q(o.modifiedAt||o.createdAt),q(o.takenAt),o.width&&o.height?`${o.width}×${o.height}`:"",o.device||"",o.lens||"",o.focalLength||"",o.iso||"",o.aperture||"",o.shutter||"",o.gps?`${o.gps.lat!=null?o.gps.lat.toFixed(5):""},${o.gps.lng!=null?o.gps.lng.toFixed(5):""}`:"",o.rating||0,o.favorite?"是":"否",o.colorLabel||"",Array.isArray(o.tags)?o.tags.join("、"):"",o.aiStatus||""]),e="\uFEFF"+[c,...a].map(o=>o.map(fe).join(",")).join(`\r
`);W(l,e,"text/csv;charset=utf-8")}function ye(v,l,c=`library-report-${I()}.html`){const a=v||{},e=r=>`${Math.min(100,Number(r)||0).toFixed(1)}%`,o=(r,$=100)=>`<div class="bar"><div class="bar-fill" style="width:${Math.max(2,Math.min(100,Number(r)/$*100))}%"></div></div>`,h=(r,$="count",C="")=>(r||[]).slice(0,10).map((F,D)=>`<tr><td class="rank">${String(D+1).padStart(2,"0")}</td><td>${j(F.name||F.label||"")}</td><td class="num">${F[$]??F.count??""}${C}</td><td class="pct">${e((F[$]??0)/Math.max(1,l)*100)}</td></tr>`).join(""),S=(a.yearlyList||[]).map(r=>`<tr><td>${r.year}</td><td class="num">${r.photo}</td><td class="num">${r.video}</td><td class="num">${r.total}</td><td class="num muted">${U(r.bytes)}</td></tr>`).join(""),z=Math.max(1,...a.hourlyList||[0]),R=(a.hourlyList||[]).map((r,$)=>`<div class="h-cell"><div class="h-bar" style="height:${r/z*100}%"></div><span class="h-lbl">${String($).padStart(2,"0")}</span></div>`).join(""),T=(a.metadataCoverage||[]).map(r=>`<tr><td>${j(r.label)}</td><td class="pct-cell">${e(r.rate)}</td><td class="bar-cell">${o(r.rate)}</td></tr>`).join(""),u=(a.healthMissing||[]).map(r=>`<span class="chip">${j(r.label)}：${r.count}</span>`).join(""),t=`<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>影像库分析报告 · ${I()}</title>
<style>
  :root { --bg:#f6f9f8; --card:#fff; --text:#202624; --sub:#66716d; --muted:#98a39f; --accent:#63b7a5; --accent-soft:#ddf1eb; --border:#e5ece9; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--text); font: 14px/1.6 -apple-system,"PingFang SC","Microsoft YaHei",sans-serif; padding: 40px 24px; }
  .wrap { max-width: 1100px; margin: 0 auto; }
  header { margin-bottom: 28px; }
  h1 { font-size: 26px; font-weight: 650; letter-spacing: -0.5px; }
  .sub { color: var(--muted); font-size: 13px; margin-top: 4px; }
  .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 28px; }
  .card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 16px 18px; }
  .card .v { font-size: 24px; font-weight: 650; color: var(--accent); }
  .card .l { font-size: 12.5px; color: var(--sub); margin-top: 2px; }
  section { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 18px 20px; margin-bottom: 16px; }
  h2 { font-size: 15px; font-weight: 650; margin-bottom: 12px; }
  h2 .tag { font-size: 11px; color: var(--muted); font-weight: 400; margin-left: 8px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { text-align: left; color: var(--muted); font-weight: 500; font-size: 12px; padding: 6px 8px; border-bottom: 1px solid var(--border); }
  td { padding: 6px 8px; border-bottom: 1px solid var(--border-light, #eef3f1); }
  .num { text-align: right; font-variant-numeric: tabular-nums; }
  .pct { text-align: right; color: var(--muted); }
  .muted { color: var(--muted); }
  .rank { color: var(--muted); width: 40px; }
  .bar-cell { width: 30%; }
  .bar { height: 8px; background: var(--accent-soft); border-radius: 4px; overflow: hidden; }
  .bar-fill { height: 100%; background: var(--accent); border-radius: 4px; }
  .pct-cell { width: 70px; text-align: right; }
  .hours { display: grid; grid-template-columns: repeat(24, 1fr); gap: 3px; align-items: end; height: 140px; }
  .h-cell { display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; }
  .h-bar { width: 100%; background: var(--accent); border-radius: 3px 3px 0 0; min-height: 2px; }
  .h-lbl { font-size: 9px; color: var(--muted); margin-top: 4px; }
  .chip { display: inline-block; padding: 3px 10px; border-radius: 20px; background: var(--accent-soft); color: var(--sub); font-size: 12px; margin: 2px 4px 2px 0; }
  footer { text-align: center; color: var(--muted); font-size: 12px; padding: 20px 0 8px; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 760px) { .grid2 { grid-template-columns: 1fr; } }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <h1>影像库分析报告</h1>
    <div class="sub">生成时间：${I()} · 数据源：${l} 个影像文件</div>
  </header>

  <div class="cards">
    <div class="card"><div class="v">${(a.total??l??0).toLocaleString()}</div><div class="l">影像总数</div></div>
    <div class="card"><div class="v">${(a.photoCount??0).toLocaleString()}</div><div class="l">照片</div></div>
    <div class="card"><div class="v">${(a.videoCount??0).toLocaleString()}</div><div class="l">视频</div></div>
    <div class="card"><div class="v">${U(a.totalBytes||0)}</div><div class="l">总容量</div></div>
    <div class="card"><div class="v">${be(a.totalVideoDuration||0)}</div><div class="l">视频总时长</div></div>
    <div class="card"><div class="v">${e(a.favRate)}</div><div class="l">收藏率（${a.favCount??0}）</div></div>
  </div>

  ${a.yearlyList&&a.yearlyList.length?`<section>
    <h2>年度影像 <span class="tag">${a.yearMin||""} — ${a.yearMax||""}</span></h2>
    <table>
      <tr><th>年份</th><th class="num">照片</th><th class="num">视频</th><th class="num">总数</th><th class="num">容量</th></tr>
      ${S}
    </table>
  </section>`:""}

  ${a.hourlyList?`<section>
    <h2>一天中的拍摄时间 <span class="tag">基于文件修改时间</span></h2>
    <div class="hours">${R}</div>
  </section>`:""}

  <div class="grid2">
    ${a.deviceList&&a.deviceList.length?`<section>
      <h2>拍摄设备 Top 10</h2>
      <table>${h(a.deviceList,"count"," 张")}</table>
    </section>`:""}
    ${a.lensList&&a.lensList.length?`<section>
      <h2>常用镜头 Top 10</h2>
      <table>${h(a.lensList)}</table>
    </section>`:""}
  </div>

  ${a.extensionList&&a.extensionList.length?`<section>
    <h2>文件格式分布</h2>
    <table>
      <tr><th>格式</th><th class="num">数量</th><th class="pct">占比</th></tr>
      ${(a.extensionList||[]).map(r=>`<tr><td>${j(r.name)}</td><td class="num">${r.count}</td><td class="pct">${e(r.count/Math.max(1,l)*100)}</td></tr>`).join("")}
    </table>
  </section>`:""}

  ${a.metadataCoverage?`<section>
    <h2>元数据完整度</h2>
    <table>
      <tr><th>维度</th><th class="pct-cell">覆盖</th><th class="bar-cell"></th></tr>
      ${T}
    </table>
  </section>`:""}

  ${a.healthScore!=null?`<section>
    <h2>影像库完整度 <span class="tag">${a.healthScore}%</span></h2>
    ${o(a.healthScore)}
    <div style="margin-top:10px">${u||'<span class="chip">数据完整</span>'}</div>
  </section>`:""}

  ${a.largest&&a.largest.length?`<section>
    <h2>最大文件 Top 10</h2>
    <table>
      <tr><th>文件名</th><th class="num">大小</th></tr>
      ${a.largest.map(r=>`<tr><td>${j(r.name)}</td><td class="num">${U(r.bytes)}</td></tr>`).join("")}
    </table>
  </section>`:""}

  <footer>VisionFlow AI · 智影库 · 本报告由本地数据生成</footer>
</div>
</body>
</html>`;W(c,t,"text/html;charset=utf-8")}const xe={class:"filter-body"},_e={class:"filter-group"},$e={class:"filter-group"},ke={class:"row"},we={class:"rating-row"},Fe={class:"filter-group"},Se={class:"filter-group"},Ce={class:"filter-group"},Me={class:"filter-group"},Ve={class:"filter-group"},Le={class:"filter-group"},ze={class:"row"},Oe={class:"row"},Re={class:"filter-footer"},Te={__name:"MediaFilter",setup(v){const l=J(),c=Q(),a=B({get:()=>l.filterDrawerOpen,set:u=>u?l.openFilterDrawer():l.closeFilterDrawer()}),e=de({types:[],favoriteOnly:!1,rating:null,people:[],places:[],tags:[],dateRange:null,hasFace:!1,hasText:!1,colorLabels:[]}),o={red:"红",yellow:"黄",green:"绿",blue:"蓝"},h=["red","yellow","green","blue"];function S(){const u=c.filters;e.types=[...u.types],e.favoriteOnly=u.favoriteOnly,e.rating=u.rating,e.people=[...u.people],e.places=[...u.places],e.tags=[...u.tags],e.dateRange=u.dateRange?u.dateRange.map(t=>new Date(t)):null,e.hasFace=u.hasFace===!0,e.hasText=u.hasText===!0,e.colorLabels=[...u.colorLabels||[]]}oe(()=>l.filterDrawerOpen,u=>{u&&S()});function z(){const u=[];if(e.types.length&&u.push({key:"types",label:"类型",value:e.types.map(t=>t==="image"?"图片":"视频").join("、")}),e.favoriteOnly&&u.push({key:"favorite",label:"仅收藏",value:"是"}),e.rating&&u.push({key:"rating",label:"最低评分",value:`${e.rating} 星`}),e.people.length&&u.push({key:"people",label:"人物",value:e.people.join("、")}),e.places.length&&u.push({key:"places",label:"地点",value:e.places.join("、")}),e.tags.length&&u.push({key:"tags",label:"标签",value:e.tags.join("、")}),e.dateRange&&e.dateRange[0]&&e.dateRange[1]){const t=r=>`${r.getFullYear()}-${String(r.getMonth()+1).padStart(2,"0")}-${String(r.getDate()).padStart(2,"0")}`;u.push({key:"date",label:"时间",value:`${t(e.dateRange[0])} ~ ${t(e.dateRange[1])}`})}e.hasFace&&u.push({key:"face",label:"包含人物",value:"是"}),e.hasText&&u.push({key:"text",label:"包含文字",value:"是"}),e.colorLabels.length&&u.push({key:"color",label:"色彩标签",value:e.colorLabels.map(t=>`${o[t]}色`).join("、")}),l.clearFilters(),u.forEach(t=>l.addFilter(t))}function R(){c.setFilters({types:[...e.types],favoriteOnly:e.favoriteOnly,rating:e.rating,people:[...e.people],places:[...e.places],tags:[...e.tags],dateRange:e.dateRange&&e.dateRange[0]&&e.dateRange[1]?[e.dateRange[0].getTime(),e.dateRange[1].getTime()]:null,hasFace:e.hasFace?!0:null,hasText:e.hasText?!0:null,colorLabels:[...e.colorLabels]}),z(),l.closeFilterDrawer()}function T(){c.clearFilters(),l.clearFilters(),S(),l.closeFilterDrawer()}return(u,t)=>{const r=f("el-checkbox"),$=f("el-checkbox-group"),C=f("el-switch"),F=f("el-radio-button"),D=f("el-radio-group"),m=f("el-button"),d=f("el-option"),M=f("el-select"),A=f("el-date-picker"),P=f("el-drawer");return b(),L(P,{modelValue:a.value,"onUpdate:modelValue":t[11]||(t[11]=s=>a.value=s),title:"筛选",size:360,class:"filter-drawer"},{footer:p(()=>[n("div",Re,[i(m,{onClick:T},{default:p(()=>[...t[27]||(t[27]=[y("清空所有",-1)])]),_:1}),i(m,{type:"primary",onClick:R},{default:p(()=>[...t[28]||(t[28]=[y("应用筛选",-1)])]),_:1})])]),default:p(()=>[n("div",xe,[n("div",_e,[t[14]||(t[14]=n("div",{class:"filter-label"},"媒体类型",-1)),i($,{modelValue:e.types,"onUpdate:modelValue":t[0]||(t[0]=s=>e.types=s)},{default:p(()=>[i(r,{value:"image"},{default:p(()=>[...t[12]||(t[12]=[y("图片",-1)])]),_:1}),i(r,{value:"video"},{default:p(()=>[...t[13]||(t[13]=[y("视频",-1)])]),_:1})]),_:1},8,["modelValue"])]),n("div",$e,[t[18]||(t[18]=n("div",{class:"filter-label"},"收藏与评分",-1)),n("div",ke,[i(C,{modelValue:e.favoriteOnly,"onUpdate:modelValue":t[1]||(t[1]=s=>e.favoriteOnly=s)},null,8,["modelValue"]),t[15]||(t[15]=n("span",{class:"row-label"},"仅显示收藏",-1))]),n("div",we,[t[17]||(t[17]=n("span",{class:"row-label"},"最低评分",-1)),i(D,{modelValue:e.rating,"onUpdate:modelValue":t[2]||(t[2]=s=>e.rating=s),size:"small"},{default:p(()=>[(b(),_(w,null,V(5,s=>i(F,{key:s,value:s},{default:p(()=>[y(k(s)+"★",1)]),_:2},1032,["value"])),64))]),_:1},8,["modelValue"]),e.rating?(b(),L(m,{key:0,link:"",type:"primary",size:"small",onClick:t[3]||(t[3]=s=>e.rating=null)},{default:p(()=>[...t[16]||(t[16]=[y(" 清除 ",-1)])]),_:1})):O("",!0)])]),n("div",Fe,[t[19]||(t[19]=n("div",{class:"filter-label"},"色彩标签",-1)),i($,{modelValue:e.colorLabels,"onUpdate:modelValue":t[4]||(t[4]=s=>e.colorLabels=s)},{default:p(()=>[(b(),_(w,null,V(h,s=>i(r,{key:s,value:s},{default:p(()=>[n("span",{class:G(["f-color-dot","c-"+s])},null,2),y(k(o[s])+"色 ",1)]),_:2},1032,["value"])),64))]),_:1},8,["modelValue"])]),n("div",Se,[t[20]||(t[20]=n("div",{class:"filter-label"},"人物",-1)),i($,{modelValue:e.people,"onUpdate:modelValue":t[5]||(t[5]=s=>e.people=s),class:"check-wrap"},{default:p(()=>[(b(!0),_(w,null,V(g(ne),s=>(b(),L(r,{key:s,value:s},{default:p(()=>[y(k(s),1)]),_:2},1032,["value"]))),128))]),_:1},8,["modelValue"])]),n("div",Ce,[t[21]||(t[21]=n("div",{class:"filter-label"},"地点",-1)),i($,{modelValue:e.places,"onUpdate:modelValue":t[6]||(t[6]=s=>e.places=s),class:"check-wrap"},{default:p(()=>[(b(!0),_(w,null,V(g(ie),s=>(b(),L(r,{key:s,value:s},{default:p(()=>[y(k(s),1)]),_:2},1032,["value"]))),128))]),_:1},8,["modelValue"])]),n("div",Me,[t[22]||(t[22]=n("div",{class:"filter-label"},"标签",-1)),i(M,{modelValue:e.tags,"onUpdate:modelValue":t[7]||(t[7]=s=>e.tags=s),multiple:"",filterable:"","collapse-tags":"",placeholder:"选择标签",style:{width:"100%"}},{default:p(()=>[(b(!0),_(w,null,V(g(re),s=>(b(),L(d,{key:s,label:s,value:s},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),n("div",Ve,[t[23]||(t[23]=n("div",{class:"filter-label"},"拍摄时间",-1)),i(A,{modelValue:e.dateRange,"onUpdate:modelValue":t[8]||(t[8]=s=>e.dateRange=s),type:"daterange","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期",style:{width:"100%"}},null,8,["modelValue"])]),n("div",Le,[t[26]||(t[26]=n("div",{class:"filter-label"},"AI 属性",-1)),n("div",ze,[i(C,{modelValue:e.hasFace,"onUpdate:modelValue":t[9]||(t[9]=s=>e.hasFace=s)},null,8,["modelValue"]),t[24]||(t[24]=n("span",{class:"row-label"},"包含人物",-1))]),n("div",Oe,[i(C,{modelValue:e.hasText,"onUpdate:modelValue":t[10]||(t[10]=s=>e.hasText=s)},null,8,["modelValue"]),t[25]||(t[25]=n("span",{class:"row-label"},"包含文字（OCR）",-1))])])])]),_:1},8,["modelValue"])}}},De=K(Te,[["__scopeId","data-v-44530ab7"]]),Ae={class:"page media-page"},je={class:"page-header"},Be={class:"page-sub"},Ue={class:"header-actions"},Ie={class:"toolbar"},Pe={class:"type-tabs"},Ne=["onClick"],Ee={class:"toolbar-right"},Ge=["disabled"],Ye={class:"ctrl-btn",type:"button",title:"导出"},He={key:0,class:"active-filters"},qe=["onClick"],Ke={class:"media-body"},Je={class:"grid-area"},Qe={__name:"Media",setup(v){const l=Q(),c=J(),a=[{key:"all",label:"全部"},{key:"image",label:"图片"},{key:"video",label:"视频"}],e=[{key:"takenAt",label:"按时间"},{key:"name",label:"按名称"},{key:"sizeMB",label:"按大小"},{key:"modifiedAt",label:"修改时间"},{key:"type",label:"类型"},{key:"rating",label:"评分"}],o=B(()=>l.filters.types.length===1?l.filters.types[0]:"all"),h=B(()=>l.sortedItems),S=B(()=>h.value.length>0&&h.value.every(m=>l.selectedIds.includes(m.id))),z=B(()=>l.items.find(m=>m.id===c.activeMediaId)||null);ce(()=>{l.fetchMedia()});function R(m){l.setFilters({types:m==="all"?[]:[m]})}function T(){S.value?l.clearSelection():l.selectAll(h.value.map(m=>m.id))}function u(m){c.openDetail(m)}function t({id:m,value:d}){const M=l.items.find(A=>A.id===m);M&&(M.rating=d,d>0&&E({message:`已评分 ${d} 星`,type:"success",duration:1e3}))}function r(){!c.infoPanelOpen&&!c.activeMediaId&&h.value.length?c.openInfo(h.value[0].id):c.toggleInfoPanel()}function $(){h.value.length&&c.openSlideshow(h.value.map(m=>m.id))}function C(m){if(m==="csv")he(h.value),E.success(`已导出 ${h.value.length} 条媒体清单`);else if(m==="report"){const d=ve(h.value);ye(d,h.value.length),E.success("分析报告已生成")}}function F(m){c.removeFilter(m);const d={};switch(m){case"types":d.types=[];break;case"favorite":d.favoriteOnly=!1;break;case"rating":d.rating=null;break;case"people":d.people=[];break;case"places":d.places=[];break;case"tags":d.tags=[];break;case"date":d.dateRange=null;break;case"face":d.hasFace=null;break;case"text":d.hasText=null;break;default:return}l.setFilters(d)}function D(){c.clearFilters(),l.clearFilters()}return(m,d)=>{const M=f("el-button"),A=f("el-option"),P=f("el-select"),s=f("el-icon"),N=f("el-tooltip"),X=f("Document"),Z=f("VideoPlay"),ee=f("Download"),Y=f("el-dropdown-item"),te=f("el-dropdown-menu"),le=f("el-dropdown"),ae=f("Close");return b(),_("div",Ae,[n("div",je,[n("div",null,[d[4]||(d[4]=n("h1",{class:"page-title"},"全部影像",-1)),n("p",Be,[y(k(g(H)(g(l).totalCount))+" 个项目 ",1),h.value.length!==g(l).totalCount?(b(),_(w,{key:0},[y(" · 当前显示 "+k(g(H)(h.value.length))+" 项",1)],64)):O("",!0),g(l).selectedCount?(b(),_(w,{key:1},[y(" · 已选择 "+k(g(l).selectedCount)+" 项",1)],64)):O("",!0)])]),n("div",Ue,[i(M,{size:"small",disabled:!g(l).selectedCount,onClick:d[0]||(d[0]=x=>g(l).clearSelection())},{default:p(()=>[...d[5]||(d[5]=[y(" 清除选择 ",-1)])]),_:1},8,["disabled"]),i(M,{size:"small",type:"primary",plain:!S.value,onClick:T},{default:p(()=>[y(k(S.value?"取消全选":"全选"),1)]),_:1},8,["plain"])])]),n("div",Ie,[n("div",Pe,[(b(),_(w,null,V(a,x=>n("button",{key:x.key,class:G(["type-tab",{active:o.value===x.key}]),type:"button",onClick:se=>R(x.key)},k(x.label),11,Ne)),64))]),n("div",Ee,[i(P,{"model-value":g(l).sortKey,size:"small",style:{width:"112px"},"onUpdate:modelValue":d[1]||(d[1]=x=>g(l).setSort(x,null))},{default:p(()=>[(b(),_(w,null,V(e,x=>i(A,{key:x.key,label:x.label,value:x.key},null,8,["label","value"])),64))]),_:1},8,["model-value"]),i(N,{content:g(l).sortOrder==="asc"?"切换为降序":"切换为升序",placement:"bottom"},{default:p(()=>[n("button",{class:"ctrl-btn",type:"button",onClick:d[2]||(d[2]=x=>g(l).setSort(null,g(l).sortOrder==="asc"?"desc":"asc"))},[i(s,{size:16},{default:p(()=>[(b(),L(ue(g(l).sortOrder==="asc"?"ArrowUp":"ArrowDown")))]),_:1})])]),_:1},8,["content"]),i(N,{content:g(c).infoPanelOpen?"关闭信息面板":"打开信息面板",placement:"bottom"},{default:p(()=>[n("button",{class:G(["ctrl-btn",{active:g(c).infoPanelOpen}]),type:"button",onClick:r},[i(s,{size:16},{default:p(()=>[i(X)]),_:1})],2)]),_:1},8,["content"]),i(N,{content:"幻灯片播放当前视图",placement:"bottom"},{default:p(()=>[n("button",{class:"ctrl-btn",type:"button",title:"幻灯片播放",disabled:!h.value.length,onClick:$},[i(s,{size:16},{default:p(()=>[i(Z)]),_:1})],8,Ge)]),_:1}),i(le,{trigger:"click",onCommand:C},{dropdown:p(()=>[i(te,null,{default:p(()=>[i(Y,{command:"csv"},{default:p(()=>[...d[6]||(d[6]=[y("导出媒体清单（CSV）",-1)])]),_:1}),i(Y,{command:"report"},{default:p(()=>[...d[7]||(d[7]=[y("导出分析报告（HTML）",-1)])]),_:1})]),_:1})]),default:p(()=>[n("button",Ye,[i(s,{size:16},{default:p(()=>[i(ee)]),_:1})])]),_:1}),i(M,{size:"small",icon:"Filter",type:g(c).activeFilters.length?"primary":"default",onClick:d[3]||(d[3]=x=>g(c).openFilterDrawer())},{default:p(()=>[d[8]||(d[8]=y(" 筛选",-1)),g(c).activeFilters.length?(b(),_(w,{key:0},[y("（"+k(g(c).activeFilters.length)+"）",1)],64)):O("",!0)]),_:1},8,["type"])])]),g(c).activeFilters.length?(b(),_("div",He,[d[9]||(d[9]=n("span",{class:"af-label"},"筛选条件",-1)),(b(!0),_(w,null,V(g(c).activeFilters,x=>(b(),_("span",{key:x.key,class:"af-chip"},[y(k(x.label)+"："+k(x.value)+" ",1),n("button",{class:"af-remove",type:"button",onClick:se=>F(x.key)},[i(s,{size:11},{default:p(()=>[i(ae)]),_:1})],8,qe)]))),128)),n("button",{class:"af-clear",type:"button",onClick:D},"一键清空")])):O("",!0),n("div",Ke,[n("div",Je,[i(me,{items:h.value,loading:g(l).loading,"view-mode":g(c).viewMode,"thumbnail-size":g(c).thumbnailSize,onOpen:u,onRate:t},null,8,["items","loading","view-mode","thumbnail-size"])]),i(pe,{name:"panel-slide"},{default:p(()=>[g(c).infoPanelOpen&&z.value?(b(),L(ge,{key:0,media:z.value,class:"inline-panel",onOpen:u},null,8,["media"])):O("",!0)]),_:1})]),i(De)])}}},lt=K(Qe,[["__scopeId","data-v-2161532c"]]);export{lt as default};
