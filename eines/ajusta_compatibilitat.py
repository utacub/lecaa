"""Aplica els ajustos de disposició i focus a l'HTML de LECAA.

Pas idempotent executat per afegeix_pwa.py després de separar els recursos.
Ús: python3 eines/ajusta_compatibilitat.py index.html
"""
from pathlib import Path
import re,hashlib,base64,sys
p=Path(sys.argv[1]);s=p.read_text()
if 'const TaskLayout=' in s:
 print('Compatibilitat ja aplicada:',p)
 sys.exit(0)
css='''
/* Fit desktop/tablet tasks to their actual workspace; keep touch targets square. */
@media(min-width:701px){
 .stage.task-banded .answers{flex-wrap:nowrap;min-width:0;max-width:100%;width:100%;align-items:flex-start;padding-inline:14px}
 .stage.task-banded .answers .tile{flex:none;width:var(--fit-choice,var(--tile));height:var(--fit-choice,var(--tile));max-width:none;max-height:none}
 .stage.task-banded .answers .tile .let{font-size:min(calc(var(--tile)*.55),calc(var(--fit-choice,var(--tile))*.55))}
 .stage.task-banded .answers .tile .lbl{font-size:min(calc(var(--tile)*.19),calc(var(--fit-choice,var(--tile))*.19))}
 .stage.task-banded[data-task-type=T2] .stim-pic{width:var(--fit-picture,calc(var(--tile)*1.15));height:var(--fit-picture,calc(var(--tile)*1.15))}
 .stage.task-banded .writing-main>.kbd{width:100%}
 .stage.task-banded .writing-main .krow{width:100%;flex-wrap:nowrap}
 .stage.task-banded .writing-main .key{flex:none;min-width:0;width:var(--fit-key-width,calc(var(--tile)*.58));height:var(--fit-key-height,calc(var(--tile)*.62));padding-inline:2px;font-size:var(--fit-key-font,calc(var(--tile)*.34))}
 .stage.task-banded .writing-main .slots{width:100%;flex-wrap:nowrap;min-width:0}
 .stage.task-banded .writing-main .slot{flex:0 1 calc(var(--tile)*.5);min-width:0;font-size:var(--fit-slot-font,calc(var(--tile)*.5))}
}
.pwa-status{flex-basis:100%;margin:0;max-width:none;line-height:1.5}
.pwa-status button{margin-left:10px}
'''
s=s.replace('</style>',css+'\n</style>',1)
s=s.replace('content="2026-10-17-presentation-v45"','content="2026-10-22-layout-offline-fix-v45"',1)
needle='    if (isGroup) { (e.box || e.group[0].parentElement).classList.add("group-focused");'
assert needle in s
s=s.replace(needle,'    if (isGroup) { TaskLayout.keepVisible(e.box || e.group[0]); (e.box || e.group[0].parentElement).classList.add("group-focused");',1)
needle='    this.focusedEl = e; e.classList.add("focused");'
assert needle in s;s=s.replace(needle,needle+' TaskLayout.keepVisible(e);',1)
needle='  refresh() { if (this.root) { const r = this.root, c = this.onCue;'
assert needle in s;s=s.replace(needle,'  refresh() { TaskLayout.schedule(); if (this.root) { const r = this.root, c = this.onCue;',1)
needle=' Access.locked=false;clearTimeout(Access.lockTimer);Access.stats={sels:0,cycles:0};\n return{stage,main,ctl};'
assert needle in s;s=s.replace(needle,' Access.locked=false;clearTimeout(Access.lockTimer);Access.stats={sels:0,cycles:0};\n TaskLayout.watch(stage);\n return{stage,main,ctl};',1)
logic='''// The available task band, rather than device identity, determines target sizes.
const TaskLayout={
 stage:null,observer:null,frame:0,
 watch(stage){
  this.stage=stage;this.observer?.disconnect();
  const band=stage.querySelector('.task-band');
  if(typeof ResizeObserver!=='undefined'&&band){this.observer=new ResizeObserver(()=>this.schedule());this.observer.observe(band);}
  this.fit();this.schedule();
 },
 schedule(){cancelAnimationFrame(this.frame);this.frame=requestAnimationFrame(()=>this.fit());},
 fit(){
  const stage=this.stage;if(!stage?.isConnected)return;
  for(const key of ['--fit-choice','--fit-picture','--fit-key-width','--fit-key-height','--fit-key-font','--fit-slot-font'])stage.style.removeProperty(key);
  if(!matchMedia('(min-width:701px)').matches)return;
  const band=stage.querySelector('.task-band'),content=band?.querySelector('.task-content');if(!content)return;
  const px=(e,k)=>parseFloat(getComputedStyle(e)[k])||0;
  const raw=getComputedStyle(stage).getPropertyValue('--tile').trim();
  const preferred=parseFloat(raw)*(raw.endsWith('rem')?px(document.documentElement,'fontSize'):1);
  const height=band.clientHeight-px(band,'paddingTop')-px(band,'paddingBottom');
  const set=(k,v)=>stage.style.setProperty(k,Math.floor(v*100)/100+'px');
  const answers=content.querySelector(':scope > .answers');
  if(answers){
   const count=answers.children.length,gap=px(answers,'columnGap');
   const width=(answers.clientWidth-px(answers,'paddingLeft')-px(answers,'paddingRight')-gap*(count-1))/count;
   const padding=px(content,'paddingTop')+px(content,'paddingBottom')+px(answers,'paddingTop')+px(answers,'paddingBottom');
   const contentGap=px(content,'rowGap');let cap;
   if(stage.dataset.taskType==='T2'){
    cap=(height-padding-contentGap)/2.15;
    const stimulus=content.querySelector('.stimulus'),pictures=stimulus?.children.length||2;
    const pictureWidth=(content.clientWidth-px(stimulus,'columnGap')*(pictures-1))/pictures;
    const size=Math.max(44,Math.min(preferred,width,cap,pictureWidth/1.15));
    set('--fit-choice',size);set('--fit-picture',size*1.15);
   }else{
    const others=[...content.children].filter(e=>e!==answers);
    cap=height-padding-others.reduce((sum,e)=>sum+e.getBoundingClientRect().height,0)-contentGap*others.length;
    set('--fit-choice',Math.max(44,Math.min(preferred,width,cap)));
   }
  }
  const writing=content.querySelector('.writing-main'),row=writing?.querySelector('.krow');
  if(row?.children.length){
   const n=row.children.length,gap=px(row,'columnGap');
   const width=Math.max(24,Math.min(preferred*.58,(writing.clientWidth-gap*(n-1))/n));
   const key=row.firstElementChild,normalHeight=px(key,'height');
   set('--fit-key-width',width);set('--fit-key-height',Math.min(normalHeight,Math.max(56,width*1.1)));
   set('--fit-key-font',Math.min(preferred*.34,width*.65));
   const slots=writing.querySelector('.slots');
   if(slots?.children.length){const sw=(slots.clientWidth-px(slots,'columnGap')*(slots.children.length-1))/slots.children.length;set('--fit-slot-font',Math.min(preferred*.5,sw*1.15));}
  }
 },
 keepVisible(element){
  // Scroll only the activity, never the page or the fixed session controls.
  const band=element?.closest?.('.task-band');if(!band)return;
  const r=element.getBoundingClientRect(),b=band.getBoundingClientRect(),margin=14;
  if(r.top<b.top+margin)band.scrollTop-=b.top+margin-r.top;
  else if(r.bottom>b.bottom-margin)band.scrollTop+=r.bottom-b.bottom+margin;
  if(r.left<b.left+margin)band.scrollLeft-=b.left+margin-r.left;
  else if(r.right>b.right-margin)band.scrollLeft+=r.right-b.right+margin;
 }
};
window.addEventListener('resize',()=>TaskLayout.schedule());
document.fonts?.ready.then(()=>TaskLayout.schedule());
document.fonts?.addEventListener('loadingdone',()=>TaskLayout.schedule());

'''
assert 'const TaskLayout=' not in s
s=s.replace('/* ===== Boot ===== */',logic+'/* ===== Boot ===== */',1)
# Keep the restrictive CSP valid after changing the inline application code.
script=re.search(r'<script>\n([\s\S]*?)</script>',s).group(0)[len('<script>'):-len('</script>')]
hash=base64.b64encode(hashlib.sha256(script.encode()).digest()).decode()
s,n=re.subn(r"(script-src (?:'self' )?)'sha256-[^']+'",lambda m:m.group(1)+f"'sha256-{hash}'",s,count=1)
assert n==1,'La política CSP no té el hash del script'
p.write_text(s)
