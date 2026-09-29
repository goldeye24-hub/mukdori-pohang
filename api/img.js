const RAW_BASE='https://raw.githubusercontent.com/goldeye24-hub/mukdori-pohang/main/assets/';
let spritePromise;
async function getSprite(){
  if(!spritePromise){
    spritePromise=Promise.all([0,1,2,3,4].map(async i=>{
      const r=await fetch(`${RAW_BASE}sprite-small-0${i}.txt`);
      if(!r.ok) throw new Error(`sprite chunk ${i} ${r.status}`);
      return (await r.text()).trim();
    })).then(a=>a.join(''));
  }
  return spritePromise;
}
function imageIndex(name=''){
  const map={
    'hero':0,'legacy':1,'tank':2,
    'menu-daege':3,'menu-kingcrab':4,'menu-dokdo':5,'menu-lobster':6,'menu-sashimi':7,'menu-mulhoe':8,
    'tour-spacewalk':9,'tour-beach':10,'tour-observatory':11,'tour-hwanho':12,'tour-museum':13,
    'v7-15':14,'v7-11':10,'v7-12':11,'v7-13':12,'v7-14':13
  };
  if(name in map) return map[name];
  let m=name.match(/^v7-img-(\d{2})$/); if(m) return Math.min(14,+m[1]);
  m=name.match(/^img(\d{2})$/); if(m) return Math.min(14,+m[1]);
  return 0;
}
export default async function handler(req,res){
  try{
    const i=imageIndex(String(req.query.name||''));
    const b64=await getSprite();
    const x=(i%5)*120, y=Math.floor(i/5)*75;
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 75" preserveAspectRatio="xMidYMid slice"><image href="data:image/webp;base64,${b64}" x="-${x}" y="-${y}" width="600" height="225" preserveAspectRatio="none"/></svg>`;
    res.setHeader('Content-Type','image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control','public, max-age=86400, s-maxage=31536000, immutable');
    res.status(200).send(svg);
  }catch(e){
    res.status(500).send(String(e&&e.message||e));
  }
}
