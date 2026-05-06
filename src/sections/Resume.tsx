import { useReveal } from '../lib/useReveal';

const experience = [
  {
    role: 'Associate Software Developer',
    org: 'Alpha Lion Trucking Pvt LTD',
    range: 'Apr 2023 — Present',
    body: 'Lead backend & system design for mobile and web. Node, Express, WebSockets, caching, React, TS, MySQL/Postgres/MongoDB/Firestore.',
  },
  {
    role: 'Freelance Full Stack Developer',
    org: 'Independent',
    range: 'Feb 2021 — Mar 2023',
    body: 'MERN apps with Stripe & PayPal integrations across React, Node, MongoDB, MySQL.',
  },
  {
    role: 'Assistant System Engineer',
    org: 'Tata Consultancy Services, Gurugram',
    range: 'Jun 2019 — Jan 2021',
    body: 'Full stack work across React, Node, MongoDB, MySQL — including payment gateway integration.',
  },
];

const education = [
  {
    school: "Dr. A.P.J. Abdul Kalam Technical University",
    range: '2015 — 2019',
    body: 'B.Tech in Information Technology.',
  },
  {
    school: 'Bloom Public Senior Secondary School, Ghaziabad',
    range: '2013 — 2015',
    body: 'Class XII — Science.',
  },
  {
    school: 'Amrita Public School, New Delhi',
    range: '2011 — 2013',
    body: 'Class X.',
  },
];

const skills = [
  { name: 'Data Structures', value: 90 },
  { name: 'JavaScript', value: 85 },
  { name: 'TypeScript', value: 80 },
  { name: 'Java', value: 80 },
  { name: 'React JS', value: 85 },
  { name: 'Node.js / Express', value: 85 },
  { name: 'Spring Boot', value: 75 },
  { name: 'WebSockets', value: 80 },
  { name: 'SQL / NoSQL', value: 80 },
  { name: 'Docker', value: 70 },
  { name: 'AWS / GCP', value: 70 },
  { name: 'Git', value: 90 },
  { name: 'HTML / CSS', value: 90 },
];

const Resume = () => {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="resume" className="relative py-32 px-6 md:px-12">
      <div ref={ref} className="reveal max-w-6xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-mute mb-4">03 — Resume</p>
        <h2 className="text-4xl md:text-6xl font-semibold mb-16 leading-tight">
          A short <span className="text-[color:var(--color-glow)]">timeline</span>.
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-glow mb-6">Experience</h3>
            <ol className="border-l border-edge ml-2">
              {experience.map((e) => (
                <li key={e.role} className="relative pl-8 pb-10">
                  <span className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-glow shadow-[0_0_0_4px_var(--color-shade)]" />
                  <h4 className="text-lg md:text-xl font-semibold">{e.role}</h4>
                  <p className="text-glow text-sm">{e.org}</p>
                  <p className="font-mono text-xs text-mute uppercase tracking-widest mt-1 mb-3">
                    {e.range}
                  </p>
                  <p className="text-mute text-sm leading-relaxed">{e.body}</p>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-glow mb-6">Education</h3>
            <ol className="border-l border-edge ml-2">
              {education.map((e) => (
                <li key={e.school} className="relative pl-8 pb-10">
                  <span className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-glow shadow-[0_0_0_4px_var(--color-shade)]" />
                  <h4 className="text-lg md:text-xl font-semibold">{e.school}</h4>
                  <p className="font-mono text-xs text-mute uppercase tracking-widest mt-1 mb-3">
                    {e.range}
                  </p>
                  <p className="text-mute text-sm leading-relaxed">{e.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-20">
          <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-glow mb-8">Skills</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-5">
            {skills.map((s) => (
              <li key={s.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">{s.name}</span>
                  <span className="font-mono text-xs text-mute">{s.value}%</span>
                </div>
                <div className="h-px bg-edge relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-glow"
                    style={{ width: `${s.value}%`, height: '2px', top: '-1px' }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Resume;
