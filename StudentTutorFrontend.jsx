import React, { useState, useEffect, useRef } from "react";

export default function DigiShikshaApp() {
  const sections = ['home','lessons','student','teacher','about','contact'];
  const refs = {
    home: useRef(null), lessons: useRef(null), student: useRef(null), teacher: useRef(null), about: useRef(null), contact: useRef(null)
  };

  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('digi_user');
    if (saved) try { setUser(JSON.parse(saved)); } catch(e){}
  }, []);

  function handleLogout() {
    localStorage.removeItem('digi_user');
    setUser(null);
    scrollToSection('home');
  }

  function scrollToSection(id){
    refs[id]?.current?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Fixed top bar with title and quick nav */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-semibold">DS</div>
            <div>
              <div className="text-lg font-bold">Digi Shiksha</div>
              <div className="text-xs text-gray-500">Vertical full-page learning platform</div>
            </div>
          </div>

          <nav className="hidden md:flex gap-2">
            {sections.map(s => (
              <button key={s} onClick={() => scrollToSection(s)} className="px-3 py-1 rounded hover:bg-gray-100">{capitalize(s)}</button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-sm">{user.name} <span className="text-xs text-gray-500">({user.role})</span></div>
                <button onClick={handleLogout} className="px-3 py-1 border rounded">Logout</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => scrollToSection('home')} className="px-3 py-1">Sign in</button>
                <button onClick={() => scrollToSection('home')} className="px-3 py-1 bg-indigo-600 text-white rounded">Get started</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Vertical full-page container with snap */}
      <main className="snap-y snap-mandatory overflow-y-auto h-screen pt-20">
        <section ref={refs.home} id="home" className="snap-start min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-600 to-indigo-500 text-white p-6">
          <div className="max-w-4xl text-center">
            <h1 className="text-5xl font-bold">Digi Shiksha</h1>
            <p className="mt-4 text-lg opacity-90">AI-powered tutor assistant for students — with teacher analytics and progress tracking. Scroll down to explore.</p>
            <div className="mt-8 flex justify-center gap-3">
              <button onClick={() => scrollToSection('student')} className="px-6 py-3 bg-white text-indigo-600 rounded-lg shadow">Student portal</button>
              <button onClick={() => scrollToSection('teacher')} className="px-6 py-3 border rounded-lg text-white/90">Teacher portal</button>
              <button onClick={() => scrollToSection('lessons')} className="px-6 py-3 border rounded-lg text-white/90">Browse lessons</button>
            </div>
            <div className="mt-12 text-sm opacity-90 grid grid-cols-2 gap-4">
              <Feature title="Personalized practice" desc="Adaptive questions and explanations." />
              <Feature title="Progress tracking" desc="Teacher dashboard and reports." />
            </div>
          </div>
        </section>

        <section ref={refs.lessons} id="lessons" className="snap-start min-h-screen flex items-center justify-center p-6 bg-slate-50">
          <div className="max-w-6xl w-full">
            <div className="bg-white rounded-2xl p-8 shadow">
              <h2 className="text-2xl font-semibold">Lessons</h2>
              <p className="text-sm text-gray-500 mt-2">A collection of lessons — open any to start learning.</p>
              <LessonsList />
            </div>
          </div>
        </section>

        <section ref={refs.student} id="student" className="snap-start min-h-screen flex items-center justify-center p-6 bg-white">
          <div className="max-w-6xl w-full">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl p-6 shadow">
                <h2 className="text-xl font-semibold">Student portal</h2>
                <p className="text-sm text-gray-500 mt-2">Access your tutor and lessons here.</p>
                <StudentAreaInner user={user} onRequireLogin={() => scrollToSection('home')} />
              </div>

              <aside className="col-span-12 lg:col-span-4 bg-white rounded-2xl p-4 shadow">
                <div className="font-medium">Your progress</div>
                <div className="mt-3 space-y-3">
                  <ProgressCard title="Overall" pct={62} />
                  <ProgressCard title="Binary Search" pct={80} />
                  <ProgressCard title="Time Complexity" pct={45} />
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section ref={refs.teacher} id="teacher" className="snap-start min-h-screen flex items-center justify-center p-6 bg-slate-50">
          <div className="max-w-6xl w-full">
            <div className="bg-white rounded-2xl p-6 shadow">
              <h2 className="text-2xl font-semibold">Teacher dashboard</h2>
              <p className="text-sm text-gray-500 mt-2">Monitor class progress and student activities.</p>
              <TeacherAreaInner user={user} onRequireLogin={() => scrollToSection('home')} />
            </div>
          </div>
        </section>

        <section ref={refs.about} id="about" className="snap-start min-h-screen flex items-center justify-center p-6 bg-white">
          <div className="max-w-4xl text-center bg-white rounded-2xl p-8 shadow">
            <h2 className="text-2xl font-semibold">About Digi Shiksha</h2>
            <p className="mt-3 text-sm text-gray-600">Digi Shiksha pairs a student-facing tutor agent (Google ADK) with teacher analytics. Built for classrooms and configurable to your SSO and content.</p>
          </div>
        </section>

        <section ref={refs.contact} id="contact" className="snap-start min-h-screen flex items-center justify-center p-6 bg-slate-50">
          <div className="max-w-4xl w-full bg-white rounded-2xl p-8 shadow">
            <h2 className="text-2xl font-semibold">Contact</h2>
            <p className="mt-2 text-sm text-gray-600">Questions, feedback or want a demo? Reach out.</p>
            <form className="mt-4 grid gap-3">
              <input placeholder="Your name" className="p-3 border rounded" />
              <input placeholder="Your email" className="p-3 border rounded" />
              <textarea placeholder="Message" className="p-3 border rounded h-28" />
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded">Send</button>
                <button type="button" className="px-4 py-2 border rounded">Clear</button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-gray-600 flex items-center justify-between">
          <div>© {new Date().getFullYear()} Digi Shiksha — All rights reserved</div>
          <div className="flex gap-4">
            <a className="hover:underline">Privacy</a>
            <a className="hover:underline">Terms</a>
            <a className="hover:underline">Help</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* Reusable smaller components used inside the full-page layout */
function LessonsList(){
  const lessons = [
    {id:'L1', title:'Binary Search'},
    {id:'L2', title:'Postfix & Prefix'},
    {id:'L3', title:'Time Complexity Basics'},
    {id:'L4', title:'Graphs: BFS/DFS'},
  ];

  return (
    <div className="mt-6 grid md:grid-cols-2 gap-4">
      {lessons.map(l => (
        <div key={l.id} className="border p-4 rounded flex items-start justify-between">
          <div>
            <div className="font-medium">{l.title}</div>
            <div className="text-xs text-gray-500">Lesson ID: {l.id}</div>
          </div>
          <div className="flex flex-col gap-2">
            <button className="px-3 py-1 bg-indigo-600 text-white rounded">Open</button>
            <button className="px-3 py-1 border rounded">Preview</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function StudentAreaInner({ user, onRequireLogin }){
  if(!user) return (
    <div className="mt-6 text-center">
      <div className="text-lg font-semibold">Please sign in to continue</div>
      <div className="mt-3"><button onClick={onRequireLogin} className="px-4 py-2 bg-indigo-600 text-white rounded">Sign in</button></div>
    </div>
  );

  return (
    <div className="mt-6">
      <h3 className="font-semibold">Welcome back, {user.name}</h3>
      <div className="mt-4"><AgentChat user={user} /></div>
    </div>
  );
}

function TeacherAreaInner({ user, onRequireLogin }){
  if(!user || user.role !== 'teacher') return (
    <div className="mt-6 text-center">
      <div className="text-lg font-semibold">Teacher access only</div>
      <div className="mt-3 text-sm text-gray-500">Sign in as a teacher to view dashboards.</div>
      <div className="mt-3"><button onClick={onRequireLogin} className="px-4 py-2 bg-indigo-600 text-white rounded">Sign in</button></div>
    </div>
  );

  const demoStudents = [
    {id:'s1', name:'Aisha', progress:0.65, lastActive:'2025-11-21'},
    {id:'s2', name:'Rahul', progress:0.42, lastActive:'2025-11-22'},
  ];

  return (
    <div className="mt-6 grid gap-3">
      {demoStudents.map(s => (
        <div key={s.id} className="flex items-center justify-between border p-3 rounded">
          <div>
            <div className="font-medium">{s.name}</div>
            <div className="text-xs text-gray-500">Last active: {s.lastActive}</div>
          </div>
          <div className="w-40 flex items-center gap-3">
            <div className="flex-1 bg-slate-100 h-2 rounded overflow-hidden">
              <div style={{ width: `${Math.floor(s.progress*100)}%` }} className="h-2 bg-indigo-600 rounded"></div>
            </div>
            <button className="px-3 py-1 border rounded">View</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Feature({ title, desc }){
  return (
    <div className="bg-white/10 p-4 rounded text-left">
      <div className="font-medium">{title}</div>
      <div className="text-sm opacity-90">{desc}</div>
    </div>
  );
}

function AgentChat({ user }) {
  const [messages, setMessages] = useState([
    { id: 1, from: 'agent', text: 'Hello! I am your Digi Shiksha study assistant. What would you like to learn today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function sendMessage(e){
    e?.preventDefault();
    if(!input.trim()) return;
    const userMsg = { id: Date.now(), from: 'user', text: input };
    setMessages(m=>[...m,userMsg]);
    setInput('');
    setIsLoading(true);
    try{
      const res = await fetch('/api/agent/chat', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ userId: user?.id, message: userMsg.text }) });
      if(!res.ok) throw new Error('agent error');
      const data = await res.json();
      const replyText = data.reply || 'Sorry, the agent had no response.';
      setMessages(m=>[...m, { id: Date.now()+1, from: 'agent', text: replyText }]);
    }catch(err){
      setMessages(m=>[...m, { id: Date.now()+2, from: 'agent', text: 'Error contacting agent. Try again later.' }]);
    }finally{ setIsLoading(false); }
  }

  return (
    <div className="flex flex-col h-[52vh]">
      <div className="flex-1 overflow-auto p-4 space-y-4 bg-slate-50 rounded">
        {messages.map(m => (
          <div key={m.id} className={`max-w-[80%] ${m.from==='agent' ? 'self-start' : 'self-end'}`}>
            <div className={`p-3 rounded-lg ${m.from==='agent' ? 'bg-white border' : 'bg-indigo-600 text-white'}`}>{m.text}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="mt-3 flex gap-2">
        <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Ask the tutor agent anything..." className="flex-1 p-3 border rounded" />
        <button disabled={isLoading} type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">{isLoading ? '...' : 'Send'}</button>
      </form>
    </div>
  );
}

function ProgressCard({ title, pct }){
  return (
    <div className="border p-3 rounded">
      <div className="flex items-center justify-between">
        <div className="font-medium">{title}</div>
        <div className="text-sm text-gray-500">{pct}%</div>
      </div>
      <div className="mt-2 bg-slate-100 h-2 rounded overflow-hidden">
        <div style={{ width: `${pct}%` }} className="h-2 bg-indigo-600 rounded"></div>
      </div>
    </div>
  );
}

function capitalize(s){ return s.charAt(0).toUpperCase()+s.slice(1); }

