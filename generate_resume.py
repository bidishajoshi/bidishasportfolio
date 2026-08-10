from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import Paragraph, Frame, Spacer

filename = 'resume.pdf'
ctx = canvas.Canvas(filename, pagesize=letter)
width, height = letter
styles = getSampleStyleSheet()

header = Paragraph('<font size=18><b>BIDISHA JOSHI</b></font>', ParagraphStyle('header', alignment=1, leading=24))
sub = Paragraph('<font size=10>+9779860829657 | bidishajoshi@gmail.com | Bhaktapur, Nepal</font>', ParagraphStyle('sub', alignment=1, leading=14))

frame = Frame(40, 40, width - 80, height - 100, showBoundary=0)
story = [header, Spacer(1, 8), sub, Spacer(1, 18)]

story.append(Paragraph('<b>SUMMARY</b>', styles['Heading4']))
summary = (
    'Versatile Full-Stack Python Developer and final-year B.Sc. CSIT candidate with strong expertise in Python, Flask, HTML/CSS3, JavaScript, Bootstrap, SQL, and RESTful API development, combined with a solid foundation in Software Quality Assurance (STLC, SDLC, Agile, manual testing, API testing, and bug reporting). '
    'Skilled in building responsive, scalable web applications and ensuring software quality through systematic testing. Seeking an entry-level Full-Stack Python Developer or QA Engineer role to leverage technical expertise, analytical problem-solving, and a passion for delivering reliable, high-quality software solutions.'
)
story.append(Paragraph(summary, ParagraphStyle('normal', leading=14, fontSize=10)))
story.append(Spacer(1, 12))

story.append(Paragraph('<b>MAJOR SKILLS</b>', styles['Heading4']))
skills = (
    'Programming Languages: C, C++, JavaScript, PHP, Python<br/>'
    'Frontend: HTML5, CSS3, JavaScript, Bootstrap, Responsive Design, UI Components<br/>'
    'UI/UX Design: Figma, Canva, Wireframing, Prototyping<br/>'
    'Data & Backend: Python (Django, Flask)<br/>'
    'Databases: MySQL, PostgreSQL<br/>'
    'Tools & Version Control: Git, GitHub, VS Code, Microsoft Word, Excel<br/>'
    'QA & Testing: Manual Testing, Functional Testing, Regression Testing, Smoke Testing, Sanity Testing, API Testing (Postman), Test Case Design, Bug Reporting, SDLC, STLC, Agile/Scrum<br/>'
    'Problem Solving & Analytical Thinking, Communication & Team Collaboration, Time Management & Attention to Detail'
)
story.append(Paragraph(skills, ParagraphStyle('normal', leading=14, fontSize=10)))
story.append(Spacer(1, 12))

story.append(Paragraph('<b>PROJECTS</b>', styles['Heading4']))
projects = [
    (
        'CareerSwipe — AI-Powered Job Recommendation Platform',
        'Developed full-stack recruitment platform connecting job seekers with employers. Designed secure authentication and role-based dashboards for applicants and companies. Built RESTful APIs and integrated PostgreSQL for efficient data management. Implemented resume parsing and ATS score analysis using Python. Deployed the application on Render with responsive frontend design.'
    ),
    (
        'Resume Analyzer',
        'Developed an AI-powered resume analysis system to evaluate resumes against job descriptions. Extracted information from PDF and DOCX resumes, calculated ATS compatibility scores, and generated improvement suggestions. Designed a clean, responsive interface for enhanced user experience.'
    ),
    (
        'Grade Calculator',
        'Built a utility to calculate grades and GPA with a user-friendly input and result summary. Automated academic score computation and provided accurate grading outputs.'
    ),
    (
        'Smart Attendance Management System',
        'Developed a web-based attendance management system with role-based authentication. Automated attendance recording and report generation. Integrated SQLite for data storage and retrieval, with responsive interfaces for students and administrators.'
    ),
    (
        'CareerSwipe — QA Testing Project',
        'Designed and executed 100+ manual test cases covering authentication, job management, resume analysis, and application workflows. Identified, documented, and tracked software defects using Jira. Performed API testing with Postman to validate REST endpoints and automated regression test scenarios using Playwright.'
    ),
]
for title, desc in projects:
    story.append(Paragraph(f'<b>{title}</b>', ParagraphStyle('projtitle', leading=13, fontSize=10)))
    story.append(Paragraph(desc, ParagraphStyle('normal', leading=14, fontSize=10)))
    story.append(Spacer(1, 8))

story.append(Spacer(1, 12))
story.append(Paragraph('<b>EDUCATION</b>', styles['Heading4']))
edu = (
    'Swastik College<br/>Bachelor of Science in Computer Science and Information Technology (B.Sc. CSIT)<br/>Chardobato, Bhaktapur, Nepal'
)
story.append(Paragraph(edu, ParagraphStyle('normal', leading=14, fontSize=10)))
story.append(Spacer(1, 12))
story.append(Paragraph('<b>LANGUAGES</b>', styles['Heading4']))
lang = 'English (Fluent) | Nepali (Native) | Hindi (Fluent)'
story.append(Paragraph(lang, ParagraphStyle('normal', leading=14, fontSize=10)))

frame.addFromList(story, ctx)
ctx.showPage()
ctx.save()
print('resume.pdf created successfully')
