import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

function useInView(t = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: t });
    obs.observe(el); return () => obs.disconnect();
  }, [t]);
  return { ref, inView };
}

// Scramble text hook
const SC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#";
function useScramble(text: string, active: boolean) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (!active) return;
    let i = 0;
    const iv = setInterval(() => {
      setOut(text.split("").map((c,j)=> c===" " ? " " : j<Math.floor(i) ? c : SC[Math.floor(Math.random()*SC.length)]).join(""));
      i += 0.45;
      if (i > text.length+2) { clearInterval(iv); setOut(text); }
    }, 28);
    return () => clearInterval(iv);
  }, [active, text]);
  return out;
}

const projects = [
  {
    index:"01", title:"Real Estate CRM", sub:"Lead-to-Conversion Platform", year:"2024–2026", type:"Production SaaS",
    desc:"Built end-to-end — automated lead ingestion from Meta & Google Ads, RBAC for 4+ user types, WhatsApp drip sequences, and a unified payment layer across Razorpay, Cashfree & Stripe.",
    stack:["React.js","Node.js","MongoDB","Redis","AWS Lambda","WhatsApp API","Razorpay"],
    numbers:[{v:"100%",l:"Manual entry cut"},{v:"−70%",l:"Follow-up time"},{v:"<200ms",l:"API at peak"},{v:"0",l:"Payment downtime"}],
    accent:"#C9971C", live:null,
  },
  {
    index:"02", title:"Live Streaming", sub:"SaaS Module", year:"2025", type:"Real-Time Infrastructure",
    desc:"Token-based session management on Agora SDK with Node.js orchestration for concurrent multi-user streams. Sub-second latency under real-world load.",
    stack:["Node.js","Agora SDK","MongoDB","JWT","WebSockets"],
    numbers:[{v:"<1s",l:"Video latency"},{v:"100+",l:"Concurrent users"},{v:"JWT",l:"Secure sessions"},{v:"0",l:"Stream failures"}],
    accent:"#D4834A", live:null,
  },
  {
    index:"03", title:"B2C Marketplace", sub:"Tech Solutions Platform", year:"2022–2023", type:"Full-Stack Product",
    desc:"Customer-to-vendor matching platform with smart filtering, Firebase auth, vendor inventory manager, and a complete admin panel for user and order lifecycle.",
    stack:["React.js","Node.js","MongoDB","Firebase"],
    numbers:[{v:"1",l:"Sole developer"},{v:"0→1",l:"Built from scratch"},{v:"Full",l:"Order lifecycle"},{v:"3",l:"User role types"}],
    accent:"#F0C040", live:null,
  },
  {
    index:"04", title:"Agriculture Export", sub:"International Website", year:"2022", type:"Live Production",
    desc:"SEO-optimized production website for an international agricultural exporter supporting buyer acquisition across multiple global markets.",
    stack:["HTML5","CSS3","Node.js"],
    numbers:[{v:"Live",l:"In production"},{v:"SEO",l:"Optimized"},{v:"Global",l:"Market reach"},{v:"Solo",l:"Built & deployed"}],
    accent:"#C9971C", live:"https://devagroexim.com",
  },
];

// 3D tilt metric box
function TiltMetric({ n, accent, bg }: { n:{v:string;l:string}; accent:string; bg:string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx,{stiffness:200,damping:20});
  const sry = useSpring(ry,{stiffness:200,damping:20});

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    const cx = (e.clientX - r.left) / r.width  - 0.5;
    const cy = (e.clientY - r.top)  / r.height - 0.5;
    rx.set(cy * -10); ry.set(cx * 10);
  };
  const onLeave = () => { rx.set(0); ry.set(0); };

  return (
    <motion.div ref={ref} style={{ rotateX:srx, rotateY:sry, transformPerspective:600, background:bg,
      padding:"clamp(1.25rem,2.5vw,1.75rem)", display:"flex", flexDirection:"column", justifyContent:"space-between", minHeight:110 }}
      onMouseMove={onMove} onMouseLeave={onLeave}>
      <div style={{fontFamily:"Inter,sans-serif",fontWeight:800,fontSize:"clamp(1.6rem,3.5vw,2.6rem)",color:"#F5F0E6",letterSpacing:"-0.04em",lineHeight:1,marginBottom:"0.4rem"}}>
        {n.v}
      </div>
      <div>
        <div style={{width:18,height:2,background:accent,borderRadius:1,marginBottom:"0.4rem",opacity:0.7}} />
        <div style={{fontFamily:"Inter,sans-serif",fontSize:"0.75rem",color:"#7A6A45",letterSpacing:"0.02em"}}>{n.l.toUpperCase()}</div>
      </div>
    </motion.div>
  );
}

function ProjectCard({ project, idx }: { project:typeof projects[0]; idx:number }) {
  const { ref, inView } = useInView(0.08);
  const isEven = idx % 2 === 0;
  const scrambledTitle = useScramble(project.title, inView);

  return (
    <div ref={ref} style={{ minHeight:"100vh", display:"flex", alignItems:"center", padding:"clamp(5rem,10vw,7rem) clamp(1.5rem,8vw,8rem)", background:isEven?"#0A0800":"#0F0B00", borderTop:"1px solid rgba(201,151,28,0.07)", position:"relative", overflow:"hidden" }}>

      {/* Ghost index */}
      <div style={{ position:"absolute", right:isEven?"3%":"auto", left:isEven?"auto":"3%", top:"50%", transform:"translateY(-50%)", fontFamily:"Inter,sans-serif", fontWeight:800, fontSize:"clamp(10rem,25vw,28rem)", color:project.accent, opacity:0.035, lineHeight:1, letterSpacing:"-0.07em", userSelect:"none", pointerEvents:"none" }}>
        {project.index}
      </div>

      <div style={{ maxWidth:1200, margin:"0 auto", width:"100%", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"clamp(3rem,8vw,8rem)", alignItems:"center", position:"relative", zIndex:1 }} className="proj-grid">

        {/* Left */}
        <motion.div
          initial={{opacity:0,x:isEven?-48:48}} animate={inView?{opacity:1,x:0}:{}}
          transition={{duration:0.85,ease:[0.16,1,0.3,1]}} style={{order:isEven?0:1}}>

          {/* Clip-path title reveal */}
          <div style={{overflow:"hidden",marginBottom:"0.5rem"}}>
            <motion.h3
              initial={{y:"100%"}} animate={inView?{y:"0%"}:{}}
              transition={{duration:0.8,delay:0.15,ease:[0.16,1,0.3,1]}}
              style={{fontFamily:"Inter,sans-serif",fontWeight:800,fontSize:"clamp(2rem,5vw,3.75rem)",lineHeight:1.0,letterSpacing:"-0.04em",color:"#F5F0E6",margin:0}}>
              {scrambledTitle}
            </motion.h3>
          </div>

          <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"1.5rem",flexWrap:"wrap"}}>
            <div style={{padding:"0.2rem 0.7rem",background:`${project.accent}14`,border:`1px solid ${project.accent}28`,borderRadius:"2px"}}>
              <span style={{fontFamily:"Inter,sans-serif",fontSize:"0.72rem",fontWeight:500,color:project.accent,letterSpacing:"0.08em"}}>{project.type}</span>
            </div>
            <span style={{fontFamily:"Inter,sans-serif",fontSize:"0.72rem",color:"#7A6A45"}}>{project.year}</span>
          </div>

          <p style={{fontFamily:"Inter,sans-serif",fontSize:"0.9rem",color:"#7A6A45",lineHeight:1.85,margin:"0 0 2rem",maxWidth:420}}>{project.desc}</p>

          <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem",marginBottom:"2rem"}}>
            {project.stack.map(s => (
              <span key={s} style={{fontFamily:"Inter,sans-serif",fontSize:"0.75rem",color:"#7A6A45",border:"1px solid rgba(201,151,28,0.14)",padding:"0.25rem 0.65rem",borderRadius:"2px"}}>{s}</span>
            ))}
          </div>

          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer"
              style={{display:"inline-flex",alignItems:"center",gap:"0.4rem",fontFamily:"Inter,sans-serif",fontSize:"0.82rem",fontWeight:500,color:project.accent,textDecoration:"none",border:`1px solid ${project.accent}30`,padding:"0.5rem 1rem",borderRadius:"2px",transition:"background 0.2s"}}
              onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background=`${project.accent}12`}
              onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background="transparent"}>
              Live ↗ {project.live.replace("https://","")}
            </a>
          )}
        </motion.div>

        {/* Right — tilt metric grid */}
        <motion.div initial={{opacity:0,x:isEven?48:-48}} animate={inView?{opacity:1,x:0}:{}}
          transition={{duration:0.85,delay:0.1,ease:[0.16,1,0.3,1]}} style={{order:isEven?1:0}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1px",background:"rgba(201,151,28,0.1)",border:"1px solid rgba(201,151,28,0.1)"}}>
            {project.numbers.map((n,ni) => (
              <TiltMetric key={ni} n={n} accent={project.accent} bg={ni%2===0?"#0A0800":"#0F0B00"} />
            ))}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginTop:"1.5rem"}}>
            <div style={{flex:1,height:1,background:`linear-gradient(to right,${project.accent}50,transparent)`}} />
            <span style={{fontFamily:"Inter,sans-serif",fontSize:"0.72rem",color:"#7A6A45"}}>{project.index} / 04</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function ProjectsScene() {
  const { ref, inView } = useInView(0.1);
  return (
    <div id="projects">
      <div ref={ref} style={{background:"#0A0800",padding:"clamp(4rem,8vw,6rem) clamp(1.5rem,8vw,8rem) clamp(1rem,3vw,2rem)"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <motion.div initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.7}}
            style={{display:"flex",alignItems:"center",gap:"1rem",marginBottom:"1.5rem"}}>
            <span style={{fontFamily:"Inter,sans-serif",fontWeight:500,fontSize:"0.72rem",color:"#C9971C",letterSpacing:"0.1em"}}>Work</span>
            <div style={{height:1,background:"rgba(201,151,28,0.2)",maxWidth:50,flex:1}} />
          </motion.div>
          <motion.h2 initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.9,delay:0.1,ease:[0.16,1,0.3,1]}}
            style={{fontFamily:"Inter,sans-serif",fontWeight:800,fontSize:"clamp(2.5rem,7vw,5.5rem)",lineHeight:0.92,letterSpacing:"-0.04em",color:"#F5F0E6",margin:"0 0 clamp(1rem,2vw,1.5rem)"}}>
            Work that shipped<br />
            <span style={{color:"transparent",WebkitTextStroke:"1.5px rgba(201,151,28,0.5)"}}>and survived.</span>
          </motion.h2>
          <motion.p initial={{opacity:0}} animate={inView?{opacity:1}:{}} transition={{delay:0.3}}
            style={{fontFamily:"Inter,sans-serif",fontSize:"0.95rem",color:"#7A6A45",lineHeight:1.7,maxWidth:500,margin:0}}>
            Four systems engineered from scratch — each starting with a real problem and ending with a measurable result.
          </motion.p>
        </div>
      </div>
      {projects.map((p,i) => <ProjectCard key={p.index} project={p} idx={i} />)}
    </div>
  );
}
