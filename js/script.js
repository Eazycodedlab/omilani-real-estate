const menu=document.querySelector('.menu');
const nav=document.querySelector('.nav');
if(menu){menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));nav.classList.toggle('open',!open);});}

document.querySelectorAll('.links a').forEach(a=>a.addEventListener('click',()=>{if(menu){menu.setAttribute('aria-expanded','false');nav.classList.remove('open')}}));

const progress=document.querySelector('.scroll-progress span');
window.addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-window.innerHeight;progress.style.width=`${max>0?(window.scrollY/max)*100:0}%`},{passive:true});

const revealEls=document.querySelectorAll('.reveal');
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});
revealEls.forEach(el=>observer.observe(el));

const track=document.querySelector('.properties-track');
const prev=document.querySelector('.prev');
const next=document.querySelector('.next');
const dots=[...document.querySelectorAll('.slide-dots i')];
if(track&&prev&&next){let offset=0;const step=384;const update=()=>{if(window.innerWidth<=650)return;const max=Math.max(0,track.scrollWidth-document.querySelector('.property-viewport').clientWidth);offset=Math.min(Math.max(offset,0),max);track.style.transform=`translateX(-${offset}px)`;dots.forEach((d,i)=>d.classList.toggle('active',Math.round(offset/step)===i));};next.addEventListener('click',()=>{offset+=step;update()});prev.addEventListener('click',()=>{offset-=step;update()});window.addEventListener('resize',update)}

// Live weekly revenue trend with portfolio analytics.
const revenueChart=document.querySelector('#revenueChart');
const revenueTotal=document.querySelector('#revenueTotal');
const revenueChange=document.querySelector('#revenueChange');
const revenueComparison=document.querySelector('#revenueComparison');
const revenueAverage=document.querySelector('#revenueAverage');
const revenuePeak=document.querySelector('#revenuePeak');
const revenueGrowth=document.querySelector('#revenueGrowth');
const revenuePeriod=document.querySelector('#revenuePeriod');
if(revenueChart&&revenueTotal&&revenueChange){
  const bars=[...revenueChart.querySelectorAll('i')];
  const weeklyTrend=[0.43,0.56,0.72,0.60,0.92,0.78,0.84];
  const days=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  let tick=0;
  let multiplier=1;
  const formatMoney=value=>`$${Math.round(value).toLocaleString('en-US')}`;
  const renderRevenue=()=>{
    const phase=tick%4;
    const drift=[0,.035,-.02,.018][phase];
    const next=weeklyTrend.map((value,index)=>Math.max(.34,Math.min(.97,value+[0,.025,-.018,.035,-.012,.02,-.025][index]+drift)));
    bars.forEach((bar,index)=>{bar.style.height=`${Math.round(next[index]*100)}%`;bar.classList.toggle('hot',index===next.indexOf(Math.max(...next)));bar.title=`${days[index]}: ${formatMoney(next[index]*15500*multiplier)}`});
    const total=next.reduce((sum,value)=>sum+value,0)*15000*multiplier;
    const average=total/next.length;
    const peakIndex=next.indexOf(Math.max(...next));
    const change=((average/10800)-1)*100;
    revenueTotal.textContent=formatMoney(total);
    revenueAverage.textContent=formatMoney(average);
    revenuePeak.textContent=days[peakIndex];
    revenueChange.textContent=`${change>=0?'+':''}${change.toFixed(1)}%`;
    revenueGrowth.textContent=`${Math.abs(change).toFixed(1)}%`;
    revenueComparison.textContent=change>=0?'vs last week':'below last week';
    tick++;
  };
  if(revenuePeriod){revenuePeriod.addEventListener('click',()=>{const options=[['7D',1],['30D',1.14],['90D',1.31]];const current=options.findIndex(o=>o[0]===revenuePeriod.dataset.period);const next=options[(current+1)%options.length];revenuePeriod.dataset.period=next[0];revenuePeriod.innerHTML=`${next[0]} <span>⌄</span>`;multiplier=next[1];renderRevenue()});revenuePeriod.dataset.period='7D';}
  renderRevenue();
  setInterval(renderRevenue,2200);
}

