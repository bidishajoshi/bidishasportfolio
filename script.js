'use strict';

/* Typed Effect */
const roles = ['Software QA Engineer','Full-Stack Python Developer','Python Enthusiast','QA Automation Learner'];
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

const repositoryCatalog=[
  {name:'CareerSwipe', description:'AI-powered job recommendation platform designed to match candidates with relevant opportunities and company roles.', language:'Python', html_url:'https://github.com/bidishajoshi/CareerSwipe', homepage:'https://careerswipe.vercel.app/', updated_at:'2024-06-11T00:00:00Z', stargazers_count:0, isFeatured:true},
  {name:'Resume Analyzer', description:'A resume and job description analyzer that scores ATS compatibility and highlights improvement areas.', language:'Python', html_url:'https://github.com/bidishajoshi/Resume-Analyzer', homepage:'https://resume-analyzer-demo.vercel.app/', updated_at:'2024-05-20T00:00:00Z', stargazers_count:0, isFeatured:true},
  {name:'Grade Calculator', description:'Interactive academic grading tool for calculating grades, percentages, and academic performance.', language:'JavaScript', html_url:'https://github.com/bidishajoshi/Grade-Calculator', homepage:'https://grade-calculator-demo.vercel.app/', updated_at:'2024-04-14T00:00:00Z', stargazers_count:0, isFeatured:true},
  {name:'JS Mini Projects', description:'A collection of JavaScript mini-projects focused on browser interactions, animations, and UI logic.', language:'JavaScript', html_url:'https://github.com/bidishajoshi/JS-project', homepage:'https://js-mini-projects-demo.vercel.app/', updated_at:'2024-03-28T00:00:00Z', stargazers_count:0, isFeatured:true},
  {name:'Attendance System', description:'Student attendance tracking system for managing class presence, reports, and productivity summaries.', language:'HTML', html_url:'https://github.com/bidishajoshi/Attendance-System', homepage:'https://attendance-system-demo.vercel.app/', updated_at:'2024-02-18T00:00:00Z', stargazers_count:0, isFeatured:true},
  {name:'QA Automation', description:'Playwright-based automated QA project for testing core user flows and verifying application reliability.', language:'JavaScript', html_url:'https://github.com/bidishajoshi/QA-Playwright', homepage:'https://qa-automation-demo.vercel.app/', updated_at:'2024-01-20T00:00:00Z', stargazers_count:0, isFeatured:true},
  {name:'Real Time Chat App', description:'Live messaging application focused on instant communication, real-time updates, and responsive user interaction.', language:'JavaScript', html_url:'https://github.com/bidishajoshi/Real-Time-Chat-App', homepage:'https://real-time-chat-demo.vercel.app/', updated_at:'2024-01-12T00:00:00Z', stargazers_count:0, isFeatured:true},
  {name:'Portfolio Website', description:'Responsive personal portfolio website built to present projects, skills, and professional profile in a modern layout.', language:'HTML', html_url:'https://github.com/bidishajoshi/bidishasportfolio', homepage:'https://bidishajoshi.com.np/', updated_at:'2024-01-08T00:00:00Z', stargazers_count:0, isFeatured:true}
];

function cleanProjectName(name){
  return String(name || 'Project').replace(/^new\s*/i, '').replace(/[-_]/g, ' ').trim();
}

function isFeatured(repo){
  const text=`${repo.name} ${repo.description || ''}`.toLowerCase();
  return repo.isFeatured || /careerswipe|resume analyzer|resume|grade calculator|attendance|playwright|qa|testing|job|student|portfolio/.test(text);
}

function formatDate(value){
  if(!value) return 'Recently updated';
  return new Date(value).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'});
}

function normalizeRepo(repo){
  const displayLang = repo.language === 'Hack' ? 'Other' : repo.language || 'Other';
  const cleanedName = cleanProjectName(repo.name || 'Project');
  return {
    ...repo,
    name: cleanedName,
    description: repo.description || 'No description provided.',
    language: displayLang,
    html_url: repo.html_url || '#',
    homepage: repo.homepage || '',
    updated_at: repo.updated_at || new Date().toISOString(),
    stargazers_count: repo.stargazers_count || 0,
    isFeatured: repo.isFeatured || isFeatured(repo)
  };
}

async function fetchProjects(){
  try{
    const res=await fetch(API_URL,{headers:{Accept:'application/vnd.github.v3+json'}});
    if(!res.ok)throw new Error(res.status);
    const repos=await res.json();
    const githubProjects=repos.map(normalizeRepo).filter(repo => !repositoryCatalog.some(item => cleanProjectName(item.name).toLowerCase() === cleanProjectName(repo.name).toLowerCase()));
    allProjects=[...repositoryCatalog].sort((a,b)=>{
      const aFeatured=isFeatured(a)?1:0;
      const bFeatured=isFeatured(b)?1:0;
      return (bFeatured-aFeatured)||b.stargazers_count-a.stargazers_count||new Date(b.updated_at)-new Date(a.updated_at);
    }).slice(0, 8);
    loading.remove();
    renderCards(allProjects);
    buildFilters(allProjects);
  }catch(err){
    console.error(err);
    loading.remove();
    allProjects=[...repositoryCatalog].slice(0, 6);
    renderCards(allProjects);
    buildFilters(allProjects);
  }
}

function renderCards(repos){
  grid.querySelectorAll('.project-card').forEach(c=>c.remove());
  emptyEl.classList.add('hidden');
  if(repos.length===0){emptyEl.classList.remove('hidden');return}
  repos.forEach((repo,i)=>{
    const card=document.createElement('article');
    card.className='project-card';
    const displayLang=repo.language==='Hack'?'Other':repo.language||'Other';
    card.dataset.lang=displayLang;
    card.style.animationDelay=`${i*0.07}s`;
    const color=LANG_COLORS[displayLang]||'#a855f7';
    const featured=isFeatured(repo);
    const safeName = cleanProjectName(repo.name);
    card.innerHTML=`
      <div class="project-card-header">
        <div class="project-card-title">
          <p class="project-name">${esc(safeName)}</p>
          ${featured?'<span class="project-featured">Featured</span>':''}
        </div>
        <a href="${repo.html_url}" target="_blank" class="project-link" aria-label="GitHub"><i class="fab fa-github"></i></a>
      </div>
      <p class="project-desc">${repo.description?esc(repo.description):'No description provided.'}</p>
      <div class="project-badges">
        <span class="project-chip">${esc(displayLang)}</span>
        <span class="project-chip project-chip-muted">Updated ${formatDate(repo.updated_at)}</span>
      </div>
      <div class="project-actions">
        <a href="${repo.html_url}" target="_blank" class="project-action-btn">View on GitHub</a>
        ${repo.homepage && repo.homepage !== '#' ? `<a href="${repo.homepage}" target="_blank" class="project-action-btn project-action-btn-alt">Live Demo</a>` : ''}
      </div>`;
    card.style.setProperty('--project-color', color);
    grid.appendChild(card);
  });
}

function buildFilters(repos){
  filterBar.innerHTML='';
  const predefined=['all','HTML','CSS','Python','JavaScript','Java','PHP','Other'];
  predefined.forEach(lang=>{
    const btn=document.createElement('button');
    btn.className='filter-btn';
    btn.dataset.filter=lang;
    btn.textContent=lang==='all' ? 'ALL' : lang;
    if(lang==='all') btn.classList.add('active');
    filterBar.appendChild(btn);
  });
  const customLangs=[...new Set(repos.map(r=>r.language||'Other').filter(l=>!predefined.includes(l)&&l!=='Hack'))].sort();
  customLangs.forEach(lang=>{
    const btn=document.createElement('button');
    btn.className='filter-btn';
    btn.dataset.filter=lang;
    btn.textContent=lang;
    filterBar.appendChild(btn);
  });
  filterBar.querySelectorAll('.filter-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      filterBar.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');activeFilter=btn.dataset.filter;applyFilter();
    });
  });
}

function applyFilter(){
  let filtered=activeFilter==='all' ? allProjects.slice(0, 8) : allProjects.filter(r=>{
    const displayLang=r.language==='Hack'?'Other':r.language||'Other';
    return displayLang===activeFilter;
  }).slice(0, 8);
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
