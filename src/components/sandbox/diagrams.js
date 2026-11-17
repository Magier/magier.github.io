
(() => {

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');

// ---------- svg vocabulary ----------
function N(k,x,y,w,h,t,s,cls=''){
  const cx=x+w/2, two=!!s;
  return `<g class="node ${cls}" data-k="${k}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/>`+
    `<text class="nt" x="${cx}" y="${two?y+24:y+h/2+4.5}">${esc(t)}</text>`+
    (two?`<text class="ns" x="${cx}" y="${y+41}" data-sub="${k}">${esc(s)}</text>`:'')+`</g>`;
}
const F=(k,d,both)=>`<path class="flow" data-k="${k}" d="${d}" pathLength="1" marker-end="url(#M)"${both?' marker-start="url(#M)"':''}/>`;
const X=(k,x,y,on)=>`<path class="xm${on?' on':''}" data-k="${k}" d="M${x-6} ${y-6}L${x+6} ${y+6}M${x+6} ${y-6}L${x-6} ${y+6}"/>`;
const L=(x,y,t,cls='lbl',anchor='start',extra='')=>`<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor}" ${extra}>${esc(t)}</text>`;
const SB=(x,y,w,h,label)=>`<rect class="sbx" x="${x}" y="${y}" width="${w}" height="${h}" rx="6"/>`+L(x+10,y+17,label);
const defs=id=>`<defs><marker id="M" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="ahp" d="M1 1L8.5 5L1 9"/></marker>`+
  `<marker id="G" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="ahg" d="M1 1L8.5 5L1 9"/></marker></defs>`;
// marker ids must be unique per page: rewrite per svg
const scoped=(svg,id)=>svg.replace(/id="M"/g,`id="${id}M"`).replace(/url\(#M\)/g,`url(#${id}M)`).replace(/id="G"/g,`id="${id}G"`).replace(/url\(#G\)/g,`url(#${id}G)`);

function travel(el,paths,dur,onSeg){
  return new Promise(res=>{
    const lens=paths.map(p=>p.getTotalLength()), total=lens.reduce((a,b)=>a+b,0);
    const place=d=>{let i=0;while(i<lens.length-1&&d>lens[i]){d-=lens[i];i++}
      const pt=paths[i].getPointAtLength(Math.min(d,lens[i]));el.setAttribute('transform',`translate(${pt.x} ${pt.y})`);onSeg&&onSeg(i)};
    if(reduced){place(total);res();return}
    const t0=performance.now();
    const f=now=>{const p=Math.min(1,(now-t0)/dur);place(p*total);p<1?requestAnimationFrame(f):res()};
    requestAnimationFrame(f);
  });
}
const sleep=ms=>new Promise(r=>setTimeout(r,reduced?0:ms));
const chip=(id,txt,w=64)=>`<g class="chip" id="${id}"><rect x="${-w/2}" y="-10" width="${w}" height="20" rx="10"/><text y="4">${esc(txt)}</text></g>`;

fig:{ if(!document.getElementById('fig-keys'))break fig;  // figure removed from post.md
  const s=document.getElementById('keys'), out=document.getElementById('keys-out');
  const P=[
    [110,'Credential injection','placeholder only','The agent only holds a placeholder. A proxy outside the sandbox checks each request and adds the real key, only for allowed destinations and actions, so the agent cannot leak that key. The proxy still needs to authorize every request. Let the proxy get its keys from a broker, and it never holds a long-lived one either.'],
    [340,'Credential broker','short-lived, scoped','A service outside the sandbox hands out a token for each task, limited to what the task needs and valid for minutes or hours. The token still enters the sandbox and can leak, but a leaked token is worth much less.'],
    [570,'Static keys','long-lived, readable','A key in a file or environment variable that works from anywhere until someone revokes it. Whoever can read it can use it, including an injected agent. The risk depends on the key’s permissions and lifetime.']
  ];
  s.innerHTML=scoped(defs()+
    `<defs><linearGradient id="keysg" x1="0" x2="1"><stop offset="0" style="stop-color:var(--n2)"/><stop offset="1" style="stop-color:var(--red)"/></linearGradient></defs>`+
    L(110,30,'KEY OUTSIDE','lbl','middle')+L(570,30,'KEY INSIDE','lbl','middle')+
    `<rect x="110" y="58" width="460" height="10" rx="5" fill="url(#keysg)"/>`+
    L(225,48,'+ key enters the sandbox','lbl','middle')+L(455,48,'+ key lives for months','lbl','middle')+
    P.map((p,i)=>`<g class="nstop" data-i="${i}" tabindex="0" role="button" aria-label="${p[1]}"><rect x="${p[0]-70}" y="46" width="140" height="76" fill="transparent"/><circle cx="${p[0]}" cy="63" r="11"/>`+
      `<text class="nt" x="${p[0]}" y="98" text-anchor="middle">${esc(p[1])}</text><text class="ns" x="${p[0]}" y="114">${esc(p[2])}</text></g>`).join(''),'k');
  const stops=[...s.querySelectorAll('.nstop')];
  const pick=i=>{stops.forEach((g,j)=>g.classList.toggle('on',j===i));out.innerHTML=`<b>${esc(P[i][1])}.</b> ${esc(P[i][3])}`};
  stops.forEach((g,i)=>{g.onclick=()=>pick(i);g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(i)}}});
  pick(0);
}
// ---------- fig: network spectrum ----------
fig:{ if(!document.getElementById('fig-net'))break fig;  // figure removed from post.md
  const s=document.getElementById('net'), out=document.getElementById('net-out');
  const P=[
    [70,'No network','nothing in or out','No network traffic is permitted across this boundary. Useful for tasks with local files and preinstalled dependencies; remote APIs require another path.'],
    [190,'Package registries','npm, PyPI only','Packages can be fetched from approved registries. Registry services, package contents, and permitted upload endpoints still need their own controls.'],
    [340,'Allowlist','named domains only','The usual middle ground. It is only as tight as what the allowed domains let you do: an allowed github.com also hosts public gists. Rules on HTTP method and path tighten it further.'],
    [480,'Denylist','block known-bad','Blocks the destinations someone thought of and allows everything else. An agent that wants out only needs one domain that is not on the list.'],
    [610,'Full internet','no limit','No destination restriction. Other controls may still apply, but the network policy does not limit where the agent connects.']
  ];
  s.innerHTML=scoped(defs()+
    `<defs><linearGradient id="netg" x1="0" x2="1"><stop offset="0" style="stop-color:var(--n2)"/><stop offset="1" style="stop-color:var(--red)"/></linearGradient></defs>`+
    L(70,30,'TIGHTER','lbl','start')+L(610,30,'LOOSER','lbl','end')+
    `<rect x="70" y="58" width="540" height="10" rx="5" fill="url(#netg)"/>`+
    L(265,48,'+ more registries','lbl','middle')+L(410,48,'+ more domains','lbl','middle')+L(545,48,'+ shorter list','lbl','middle')+
    P.map((p,i)=>`<g class="nstop" data-i="${i}" tabindex="0" role="button" aria-label="${p[1]}"><rect x="${p[0]-55}" y="46" width="110" height="76" fill="transparent"/><circle cx="${p[0]}" cy="63" r="11"/>`+
      `<text class="nt" x="${p[0]}" y="98" text-anchor="middle">${esc(p[1])}</text><text class="ns" x="${p[0]}" y="114">${esc(p[2])}</text></g>`).join(''),'n');
  const stops=[...s.querySelectorAll('.nstop')];
  const pick=i=>{stops.forEach((g,j)=>g.classList.toggle('on',j===i));out.innerHTML=`<b>${esc(P[i][1])}.</b> ${esc(P[i][3])}`};
  stops.forEach((g,i)=>{g.onclick=()=>pick(i);g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(i)}}});
  pick(0);
}

// ---------- fig: reach ----------

})();
