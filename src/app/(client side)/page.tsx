import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeCheck,
  Binary,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ExternalLink,
  Fingerprint,
  GraduationCap,
  Landmark,
  LockKeyhole,
  Mail,
  MapPin,
  MessageCircle,
  Network,
  Radar,
  ShieldCheck,
  TerminalSquare,
  UserRoundCheck,
} from "lucide-react";
import { siteUrl } from "@/lib/site";

const navLinks = [
  ["Profile", "#profile"],
  ["Experience", "#experience"],
  ["Expertise", "#expertise"],
  ["Services", "#services"],
  ["Credentials", "#credentials"],
  ["DigitX", "#digitx"],
  ["Contact", "#contact"],
] as const;

const skills = [
  "Network Security",
  "Vulnerability Assessment",
  "Nmap",
  "Nessus",
  "Burp Suite",
  "Metasploit",
  "Kali Linux",
  "SOC Operations",
  "SIEM Fundamentals",
  "Digital Forensics",
  "OSINT & Investigation",
  "Meta Platform Security",
  "Incident Response",
];

const certifications = [
  "EC-Council NDE",
  "Cisco Networking Academy — Introduction to Ethical Hacking and Penetration Testing",
  "Diploma in Digital Forensic Investigation",
  "OSINT & Investigation T1",
  "Alison — Unraveling FISMA: Cybersecurity With Regulatory Frameworks",
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: "Akramul Islam",
      jobTitle: "Cyber Security Expert & Digital Security Consultant",
      url: siteUrl,
      image: `${siteUrl}/Hero.png`,
      address: { "@type": "PostalAddress", addressLocality: "Dhaka", addressCountry: "BD" },
      worksFor: { "@type": "Organization", name: "BanglaVision Television" },
      alumniOf: { "@type": "EducationalOccupationalCredential", credentialCategory: "Diploma in Computer Engineering" },
    },
    {
      "@type": "Organization",
      name: "DigitX",
      url: siteUrl,
      description: "Cyber Security & Digital Protection Agency serving Bangladesh.",
      founder: { "@type": "Person", name: "Akramul Islam" },
      areaServed: { "@type": "Country", name: "Bangladesh" },
    },
  ],
};

function SectionTitle({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return (
    <div className="max-w-3xl">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="section-title mt-4">{title}</h2>
      {copy ? <p className="section-copy mt-5">{copy}</p> : null}
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="overflow-hidden bg-[#030816] text-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <header className="absolute inset-x-0 top-0 z-20">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 lg:px-8" aria-label="Main navigation">
          <Link href="#top" className="group inline-flex items-center gap-3 text-sm font-semibold tracking-[0.18em] text-white">
            <span className="grid size-9 place-items-center rounded-xl border border-cyan-300/30 bg-cyan-400/10 font-mono text-cyan-200 transition group-hover:border-cyan-200/70">AI</span>
            <span>AKRAMUL<span className="text-cyan-300">.SECURITY</span></span>
          </Link>
          <div className="hidden items-center gap-6 text-sm text-slate-300 lg:flex">
            {navLinks.map(([label, href]) => <a key={href} className="transition hover:text-cyan-200" href={href}>{label}</a>)}
          </div>
          <a className="button-ghost hidden sm:inline-flex" href="/cv.pdf" download>
            Download CV <ArrowDownRight className="size-4" />
          </a>
        </nav>
      </header>

      <section id="top" className="relative isolate min-h-[780px] border-b border-white/10">
        <div className="grid-lines absolute inset-0 -z-20 opacity-70" />
        <div className="absolute -left-24 top-12 -z-10 size-[34rem] rounded-full bg-blue-600/20 blur-[140px]" />
        <div className="absolute right-0 top-1/3 -z-10 size-[28rem] rounded-full bg-cyan-400/10 blur-[125px]" />
        <div className="mx-auto grid min-h-[780px] max-w-7xl items-end gap-8 px-5 pt-32 md:grid-cols-[1.1fr_.9fr] lg:px-8">
          <div className="pb-20 pt-16 md:pb-28">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/5 px-3 py-1.5 text-xs font-medium tracking-wider text-cyan-100">
              <span className="size-1.5 rounded-full bg-cyan-300 shadow-[0_0_14px_3px_rgba(103,232,249,.7)]" /> Dhaka, Bangladesh
            </div>
            <p className="mt-8 font-mono text-xs uppercase tracking-[0.24em] text-blue-300">Cyber Security · Digital Protection</p>
            <h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-[1.03] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Akramul Islam
              <span className="mt-4 block text-2xl font-medium leading-tight text-slate-300 sm:text-3xl">Cyber Security Expert &amp; Digital Security Consultant</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Helping people, brands, and digital teams strengthen their security posture across social platforms, content operations, and connected systems.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a className="button-primary" href="#contact">Start a conversation <ArrowUpRight className="size-4" /></a>
              <a className="button-ghost" href="#experience">View experience <ChevronRight className="size-4" /></a>
            </div>
          </div>

          <div className="relative min-h-[480px] self-end md:min-h-[620px]">
            <div className="absolute inset-x-[12%] bottom-10 top-12 rounded-[2.25rem] border border-cyan-300/15 bg-gradient-to-b from-blue-500/15 to-transparent" />
            <div className="absolute inset-x-[4%] bottom-0 h-[80%] rounded-t-[12rem] border-x border-t border-white/10 bg-gradient-to-t from-[#071a37] via-[#061a36]/50 to-transparent" />
            <Image className="absolute bottom-0 left-1/2 z-10 h-[92%] w-auto max-w-[112%] -translate-x-1/2 object-contain object-bottom" src="/Hero.png" width={1355} height={1858} priority sizes="(max-width: 768px) 90vw, 44vw" alt="Akramul Islam" />
            <div className="absolute bottom-8 left-0 z-10 rounded-2xl border border-white/10 bg-[#07152d]/85 px-4 py-3 shadow-2xl backdrop-blur sm:left-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-300">Security focus</p>
              <p className="mt-1 text-sm font-medium text-white">Resilience, response &amp; protection</p>
            </div>
          </div>
        </div>
      </section>

      <section id="profile" className="section-shell grid gap-12 py-24 lg:grid-cols-[1.05fr_.95fr] lg:py-32">
        <SectionTitle eyebrow="01 / Professional profile" title="Security work that meets people where the risk is." copy="Akramul brings together practical cybersecurity, digital investigation, and platform-aware protection. His work is grounded in clear guidance, careful handling of digital assets, and responsible incident response." />
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            [ShieldCheck, "Protection-led", "Digital asset security and safe operational practices."],
            [Fingerprint, "Investigation-aware", "OSINT and digital forensics foundations for informed response."],
            [Radar, "Platform fluent", "Practical support for Meta platform security and policy workflows."],
            [Network, "Systems minded", "Network, vulnerability, and SOC fundamentals in one toolkit."],
          ].map(([Icon, title, copy]) => {
            const CardIcon = Icon as typeof ShieldCheck;
            return <div key={title as string} className="surface-card"><CardIcon className="size-5 text-cyan-300" /><h3 className="mt-8 font-semibold text-white">{title as string}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{copy as string}</p></div>;
          })}
        </div>
      </section>

      <section id="current-role" className="border-y border-white/10 bg-[#061126]">
        <div className="section-shell grid gap-9 py-20 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:py-24">
          <div><p className="eyebrow">02 / Current employment</p><h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">BanglaVision Television</h2><p className="mt-3 font-mono text-sm text-cyan-300">October 2025 — Present</p></div>
          <div className="rounded-3xl border border-blue-300/15 bg-blue-400/[.04] p-6 sm:p-8">
            <div className="flex gap-4"><div className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-400/15 text-blue-200"><Building2 className="size-5" /></div><div><p className="text-sm text-slate-400">Position</p><h3 className="mt-1 text-xl font-semibold text-white">Social Media &amp; SEO Security Executive</h3></div></div>
            <ul className="mt-7 grid gap-3 text-sm leading-6 text-slate-300 sm:grid-cols-2">
              {["Social media security and digital asset protection", "SEO and digital content security", "Meta platform policy and monetization support", "Copyright and content protection", "Social media troubleshooting and security support"].map((item) => <li key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-cyan-300" />{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section id="experience" className="section-shell py-24 lg:py-32">
        <SectionTitle eyebrow="03 / Career timeline" title="A focused path through cybersecurity practice and education." />
        <div className="relative mt-14 border-l border-cyan-300/25 pl-7 sm:pl-10">
          <div className="timeline-dot" />
          <div className="relative pb-14"><span className="timeline-marker"><BriefcaseBusiness className="size-4" /></span><p className="font-mono text-xs tracking-wider text-cyan-300">OCT 2025 — PRESENT</p><h3 className="mt-3 text-xl font-semibold text-white">BanglaVision Television</h3><p className="mt-1 text-slate-400">Social Media &amp; SEO Security Executive</p></div>
          <div className="relative pb-14"><span className="timeline-marker"><TerminalSquare className="size-4" /></span><p className="font-mono text-xs tracking-wider text-cyan-300">JAN 2024 — MAR 2024</p><h3 className="mt-3 text-xl font-semibold text-white">D-Codes Lab</h3><p className="mt-1 text-slate-400">SOC Intern</p></div>
          <div className="relative"><span className="timeline-marker"><GraduationCap className="size-4" /></span><p className="font-mono text-xs tracking-wider text-cyan-300">D-CODES LAB</p><h3 className="mt-3 text-xl font-semibold text-white">Cybersecurity Instructor &amp; Project-Based Cybersecurity Trainer</h3><p className="mt-1 max-w-2xl text-slate-400">Instruction and project-based cybersecurity training through D-Codes Lab.</p></div>
        </div>
      </section>

      <section id="expertise" className="border-y border-white/10 bg-[#061126]">
        <div className="section-shell py-24 lg:py-32"><SectionTitle eyebrow="04 / Technical expertise" title="Applied security fundamentals for modern digital operations." copy="A practical toolkit spanning discovery, assessment, investigation, monitoring and response." />
          <div className="mt-12 flex flex-wrap gap-3">{skills.map((skill, index) => <span key={skill} className="skill-chip"><span className="font-mono text-[10px] text-cyan-300">{String(index + 1).padStart(2, "0")}</span>{skill}</span>)}</div>
        </div>
      </section>

      <section id="services" className="section-shell py-24 lg:py-32">
        <SectionTitle eyebrow="05 / Digital protection services" title="Security support focused on real digital operations." copy="DigitX is positioned to support people, brands, and teams in Bangladesh with practical security guidance across the areas below." />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            [ShieldCheck, "Social media & digital asset protection", "Security support for social accounts, digital assets, content operations and platform troubleshooting."],
            [Radar, "Security assessment & response guidance", "Vulnerability assessment fundamentals, incident response guidance and safer operational practices."],
            [Fingerprint, "Investigation & security awareness", "OSINT and digital forensics foundations, alongside project-based cybersecurity training."],
          ].map(([Icon, title, copy]) => {
            const ServiceIcon = Icon as typeof ShieldCheck;
            return <article key={title as string} className="surface-card"><ServiceIcon className="size-6 text-cyan-300" /><h3 className="mt-9 text-lg font-semibold text-white">{title as string}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{copy as string}</p></article>;
          })}
        </div>
      </section>

      <section id="credentials" className="section-shell py-24 lg:py-32">
        <SectionTitle eyebrow="06 / Education & credentials" title="Verified qualifications and professional training." copy="Diploma in Computer Engineering, supported by the following verified certifications and courses." />
        <div className="mt-12 grid gap-4 lg:grid-cols-[1.35fr_.65fr]">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[.025]">
            {certifications.map((certificate, index) => <div key={certificate} className="flex gap-5 border-b border-white/10 p-5 last:border-0 sm:p-6"><span className="mt-0.5 font-mono text-xs text-cyan-300">0{index + 1}</span><p className="text-sm leading-6 text-slate-200 sm:text-base">{certificate}</p><BadgeCheck className="ml-auto mt-0.5 size-5 shrink-0 text-blue-300" /></div>)}
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
            <div className="relative min-h-40 overflow-hidden rounded-3xl border border-white/10 bg-[#07152d]"><Image src="/EC-Council.jpeg" fill sizes="(max-width: 1024px) 45vw, 25vw" className="object-cover opacity-80" alt="EC-Council credential" /></div>
            <div className="relative min-h-40 overflow-hidden rounded-3xl border border-white/10 bg-[#07152d]"><Image src="/alisonCeriti.png" fill sizes="(max-width: 1024px) 45vw, 25vw" className="object-cover opacity-80" alt="Alison credential" /></div>
          </div>
        </div>
      </section>

      <section id="training" className="border-y border-white/10 bg-[#061126]"><div className="section-shell py-24 lg:py-32"><SectionTitle eyebrow="07 / Training engagements" title="Cybersecurity training delivered through D-Codes Lab." copy="The following are training engagements, not employment relationships with the participating institutions." />
        <div className="mt-12 grid gap-4 md:grid-cols-3">{[[Landmark, "Bangladesh Police", "Cybersecurity training engagement."], [ShieldCheck, "Bangladesh Army-related training", "Cybersecurity training engagement."], [Building2, "Banking sector", "Cybersecurity training engagement."]].map(([Icon, title, copy]) => { const TrainingIcon = Icon as typeof Landmark; return <article key={title as string} className="surface-card"><TrainingIcon className="size-6 text-cyan-300" /><h3 className="mt-9 text-lg font-semibold text-white">{title as string}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{copy as string}</p></article>; })}</div>
      </div></section>

      <section id="achievements" className="section-shell py-24 lg:py-32"><SectionTitle eyebrow="08 / Verified highlights" title="Professional facts, without inflated metrics." copy="This portfolio publishes only the experience, qualifications, and work descriptions confirmed for Akramul Islam." />
        <div className="mt-12 grid gap-4 md:grid-cols-3"><article className="highlight-card"><Clock3 className="size-6 text-cyan-300" /><h3>Current role</h3><p>Social Media &amp; SEO Security Executive at BanglaVision Television since October 2025.</p></article><article className="highlight-card"><UserRoundCheck className="size-6 text-cyan-300" /><h3>Security education</h3><p>Cybersecurity instruction and project-based training through D-Codes Lab.</p></article><article className="highlight-card"><LockKeyhole className="size-6 text-cyan-300" /><h3>Verified training</h3><p>Published credentials retain their actual certificate and course names.</p></article></div>
      </section>

      <section id="digitx" className="relative border-y border-blue-300/20 bg-[radial-gradient(ellipse_at_top_right,_rgba(37,99,235,.24),transparent_52%),#07152d]"><div className="section-shell grid gap-10 py-24 lg:grid-cols-[1fr_.85fr] lg:items-center lg:py-32"><div><p className="eyebrow">09 / Founder — DigitX</p><h2 className="section-title mt-4">Cyber Security &amp; Digital Protection Agency.</h2><p className="section-copy mt-6">DigitX is Akramul Islam&apos;s business brand, initially focused on helping people and organisations in Bangladesh build safer digital operations.</p><a className="button-primary mt-8" href="#contact">Discuss digital protection <ArrowUpRight className="size-4" /></a></div><div className="rounded-[2rem] border border-cyan-300/20 bg-[#061126]/70 p-7 sm:p-10"><Binary className="size-9 text-cyan-300" /><p className="mt-10 font-mono text-xs uppercase tracking-[0.22em] text-blue-300">DigitX / Bangladesh</p><p className="mt-3 text-2xl font-medium leading-snug text-white">A clear, security-first partner for digital protection.</p><div className="mt-9 border-t border-white/10 pt-5 text-sm text-slate-400">Founder <span className="ml-3 text-slate-100">Akramul Islam</span></div></div></div></section>

      <section id="contact" className="section-shell py-24 lg:py-32"><div className="contact-panel"><div><p className="eyebrow">10 / Contact</p><h2 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Let&apos;s make your digital presence more resilient.</h2><p className="mt-6 max-w-xl leading-7 text-slate-300">For cybersecurity, social media security, or digital protection enquiries, get in touch directly.</p></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1"><a className="contact-link" href="mailto:digitx.comilla@gmail.com"><Mail className="size-5 text-cyan-300" /><span><small>Email</small>digitx.comilla@gmail.com</span><ExternalLink className="ml-auto size-4 text-slate-500" /></a><a className="contact-link" href="https://wa.me/8801690203446" target="_blank" rel="noreferrer"><MessageCircle className="size-5 text-cyan-300" /><span><small>WhatsApp</small>+880 1690 203446</span><ExternalLink className="ml-auto size-4 text-slate-500" /></a><div className="contact-link"><MapPin className="size-5 text-cyan-300" /><span><small>Based in</small>Dhaka, Bangladesh</span></div></div></div></section>

      <footer className="border-t border-white/10"><div className="section-shell flex flex-col gap-4 py-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} Akramul Islam. All rights reserved.</p><div className="flex gap-5">{navLinks.slice(1).map(([label, href]) => <a className="transition hover:text-cyan-200" key={href} href={href}>{label}</a>)}</div></div></footer>
    </main>
  );
}
