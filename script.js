'use strict';

/* Typed Effect */
const roles = ['Frontend Developer','Python Enthusiast','Graphics Designer','CSIT Student','Creative Thinker'];
let roleIdx=0,charIdx=0,deleting=false;
const typedEl=document.getElementById('typedText');
function type(){
  const cur=roles[roleIdx];
  if(!deleting){typedEl.textContent=cur.slice(0,++charIdx);if(charIdx===cur.length){deleting=true;setTimeout(type,1800);return}}
  else{typedEl.textContent=cur.slice(0,--charIdx);if(charIdx===0){deleting=false;roleIdx=(roleIdx+1)%roles.length}}
  setTimeout(type,deleting?60:100);
}
setTimeout(type,800);

/* Navbar */
const navbar=document.getElementById('navbar');
const backTop=document.getElementById('backTop');
window.addEventListener('scroll',()=>{
  navbar.classList.toggle('scrolled',window.scrollY>80);
  backTop.classList.toggle('visible',window.scrollY>400);
  updateActiveNav();
},{passive:true});
backTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

function updateActiveNav(){
  const secs=document.querySelectorAll('section[id]');
  const links=document.querySelectorAll('.nav-link');
  let cur='';
  secs.forEach(s=>{if(window.scrollY>=s.offsetTop-140)cur=s.id});
  links.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+cur));
}

/* Hamburger */
const hamburger=document.getElementById('hamburger');
const navLinks=document.getElementById('navLinks');
hamburger.addEventListener('click',()=>{hamburger.classList.toggle('open');navLinks.classList.toggle('open')});
document.querySelectorAll('.nav-link').forEach(l=>l.addEventListener('click',()=>{hamburger.classList.remove('open');navLinks.classList.remove('open')}));

/* Theme Toggle */
const html=document.documentElement;
const themeToggle=document.getElementById('themeToggle');
const themeIcon=document.getElementById('themeIcon');
const saved=localStorage.getItem('bj-theme')||'light';
html.setAttribute('data-theme',saved);
updateIcon(saved);
themeToggle.addEventListener('click',()=>{
  const next=html.getAttribute('data-theme')==='dark'?'light':'dark';
  html.setAttribute('data-theme',next);
  localStorage.setItem('bj-theme',next);
  updateIcon(next);
});
function updateIcon(t){themeIcon.className=t==='dark'?'fas fa-sun':'fas fa-moon'}

/* Reveal on scroll */
const revealObs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObs.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>revealObs.observe(el));

/* Skill bars */
const skillObs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.querySelectorAll('.skill-fill').forEach(f=>f.classList.add('animated'));skillObs.unobserve(e.target)}}),{threshold:.3});
document.querySelectorAll('.skills-grid').forEach(el=>skillObs.observe(el));

/* GitHub Projects */
const GITHUB_USER='bidishajoshi';
const API_URL=`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`;
const grid=document.getElementById('projectsGrid');
const loading=document.getElementById('projectsLoading');
const emptyEl=document.getElementById('projectsEmpty');
const filterBar=document.getElementById('filterBar');

const LANG_COLORS={HTML:'#e44d26',CSS:'#264de4',JavaScript:'#d4a017',TypeScript:'#3178c6',Python:'#3572A5','C++':'#f34b7d',C:'#555555',PHP:'#4f5d95',Java:'#b07219',Ruby:'#701516',Go:'#00add8',Rust:'#dea584'};
let allProjects=[];
let activeFilter='all';

async function fetchProjects(){
  try{
    const res=await fetch(API_URL);
    if(!res.ok)throw new Error(res.status);
    const repos=await res.json();
    allProjects=repos.filter(r=>!r.fork).sort((a,b)=>b.stargazers_count-a.stargazers_count||new Date(b.updated_at)-new Date(a.updated_at));
    loading.remove();
    if(allProjects.length===0)showFallback(); else{renderCards(allProjects);buildFilters(allProjects)}
  }catch(err){
    console.error(err);
    loading.innerHTML='<i class="fas fa-exclamation-circle" style="font-size:2rem;color:var(--text-muted)"></i><p>Could not load repositories. <a href="https://github.com/'+GITHUB_USER+'" target="_blank" style="color:var(--primary)">Visit GitHub →</a></p>';
  }
}

function showFallback(){
  allProjects=[
    {name:'Portfolio Website',description:'Personal portfolio built with HTML, CSS, and JavaScript showcasing projects and skills.',language:'HTML',html_url:'https://github.com/'+GITHUB_USER,stargazers_count:0},
    {name:'Python Scripts',description:'A collection of useful Python automation and utility scripts.',language:'Python',html_url:'https://github.com/'+GITHUB_USER,stargazers_count:0},
    {name:'CSS Animations',description:'Creative CSS animations and visual effects for web projects.',language:'CSS',html_url:'https://github.com/'+GITHUB_USER,stargazers_count:0},
  ];
  renderCards(allProjects);buildFilters(allProjects);
}

function renderCards(repos){
  grid.querySelectorAll('.project-card').forEach(c=>c.remove());
  emptyEl.classList.add('hidden');
  if(repos.length===0){emptyEl.classList.remove('hidden');return}
  repos.forEach((repo,i)=>{
    const card=document.createElement('article');
    card.className='project-card';
    card.dataset.lang=repo.language||'Other';
    card.style.animationDelay=`${i*0.07}s`;
    const lang=repo.language||'Other';
    const color=LANG_COLORS[lang]||'#a855f7';
    card.innerHTML=`
      <div class="project-card-header">
        <p class="project-name">${esc(repo.name.replace(/[-_]/g,' '))}</p>
        <a href="${repo.html_url}" target="_blank" class="project-link" aria-label="GitHub"><i class="fab fa-github"></i></a>
      </div>
      <p class="project-desc">${repo.description?esc(repo.description):'No description provided.'}</p>
      <div class="project-footer">
        <div class="project-lang"><span class="lang-dot" style="background:${color}"></span>${esc(lang)}</div>
        ${repo.stargazers_count>0?`<div class="project-stars"><i class="fas fa-star"></i>${repo.stargazers_count}</div>`:''}
        <a href="${repo.html_url}" target="_blank" style="margin-left:auto;font-size:.78rem;color:var(--primary);font-weight:600">View →</a>
      </div>`;
    grid.appendChild(card);
  });
}

function buildFilters(repos){
  const langs=['all',...new Set(repos.map(r=>r.language||'Other').filter(Boolean))];
  const predefined=['all','HTML','CSS','Python','JavaScript','Other'];
  langs.forEach(lang=>{
    if(!predefined.includes(lang)){
      const btn=document.createElement('button');
      btn.className='filter-btn';btn.dataset.filter=lang;btn.textContent=lang;
      filterBar.appendChild(btn);
    }
  });
  filterBar.querySelectorAll('.filter-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      filterBar.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');activeFilter=btn.dataset.filter;applyFilter();
    });
  });
}

function applyFilter(){
  let filtered=activeFilter==='all'?allProjects:allProjects.filter(r=>(r.language||'Other')===activeFilter);
  renderCards(filtered);
}

function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}

fetchProjects();

/* Contact Form */
const contactForm=document.getElementById('contactForm');
const formNote=document.getElementById('formNote');
contactForm.addEventListener('submit',e=>{
  e.preventDefault();
  const name=document.getElementById('name').value.trim();
  const email=document.getElementById('email').value.trim();
  const message=document.getElementById('message').value.trim();
  if(!name||!email||!message){setNote('Please fill in all fields.','error');return}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){setNote('Please enter a valid email.','error');return}
  const btn=contactForm.querySelector('button[type="submit"]');
  btn.disabled=true;btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Sending…';
  setTimeout(()=>{
    contactForm.reset();btn.disabled=false;btn.innerHTML='Send Message <i class="fas fa-paper-plane"></i>';
    setNote("✅ Message sent! I'll get back to you soon.",'success');
    setTimeout(()=>setNote('',''),5000);
  },1500);
});
function setNote(m,t){formNote.textContent=m;formNote.className='form-note '+t}

/* Smooth scroll */
document.querySelectorAll('a[href^="#"]').forEach(link=>{
  link.addEventListener('click',e=>{
    const t=document.querySelector(link.getAttribute('href'));
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'})}
  });
});
