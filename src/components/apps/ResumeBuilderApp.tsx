"use client";

import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Download, Sparkles, GripVertical, Plus, Trash2, Brain } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { WindowInstance } from "@/store/useOSStore";

// --- Sortable Item Wrapper ---
function SortableSection({ id, children, onRemove }: { id: string, children: React.ReactNode, onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group bg-white/[0.02] border border-white/10 rounded-xl p-4 mb-4 hover:border-white/20 transition-colors">
      <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button {...attributes} {...listeners} className="p-1.5 bg-white/5 rounded-lg hover:bg-white/10 text-white/40 cursor-grab active:cursor-grabbing">
          <GripVertical className="w-4 h-4" />
        </button>
        <button onClick={onRemove} className="p-1.5 bg-white/5 rounded-lg hover:bg-red-500/20 text-white/40 hover:text-red-400">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      {children}
    </div>
  );
}

const INITIAL_SECTIONS = [
  { id: "personal", type: "Personal Details" },
  { id: "experience", type: "Experience" },
  { id: "education", type: "Education" },
  { id: "skills", type: "Skills" },
];

export default function ResumeBuilderApp({ window: _window }: { window: WindowInstance }) {
  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  
  // Resume Data State
  const [personal, setPersonal] = useState({ name: "Alex Developer", role: "Software Engineer", email: "alex@example.com", phone: "+1 234 567 890", linkedin: "linkedin.com/in/alex", github: "github.com/alex" });
  const [experiences, setExperiences] = useState([{ id: "1", title: "Frontend Intern", company: "TechNova", date: "Jan 2025 - Present", desc: "Built dynamic UIs using React & Next.js." }]);
  const [educations, setEducations] = useState([{ id: "1", degree: "B.S. Computer Science", school: "State University", date: "2022 - 2026", desc: "GPA: 3.8/4.0" }]);
  const [skills, setSkills] = useState("React, TypeScript, Next.js, Node.js, Python, CSS");

  const [aiSuggestion, setAiSuggestion] = useState("");

  const componentRef = useRef<HTMLDivElement>(null);
  
  // react-to-print logic for PDF export
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${personal.name}_Resume`,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const getAIOptimization = () => {
    setAiSuggestion("Analyzing...");
    setTimeout(() => {
      setAiSuggestion("Suggestion: Instead of 'Built dynamic UIs', try 'Architected responsive single-page applications using Next.js, improving load times by 40%.'");
    }, 1500);
  };

  return (
    <div className="flex h-full bg-[#0a0a0a] text-white">
      {/* Left Panel: Editor & Controls */}
      <div className="w-[500px] border-r border-white/10 flex flex-col bg-white/[0.01]">
        
        {/* Header Tabs */}
        <div className="flex p-4 gap-2 border-b border-white/5">
          <button 
            onClick={() => setActiveTab('editor')}
            className={cn("flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all", activeTab === 'editor' ? "bg-white/10 text-white" : "text-white/40 hover:bg-white/5")}
          >
            Editor
          </button>
          <button 
            onClick={() => setActiveTab('preview')}
            className={cn("flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all", activeTab === 'preview' ? "bg-white/10 text-white" : "text-white/40 hover:bg-white/5")}
          >
            Preview
          </button>
        </div>

        {/* AI Assistant Banner */}
        <div className="m-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-1">AI Resume Optimizer</h4>
              <p className="text-sm text-blue-100/70 mb-3">{aiSuggestion || "Let AI analyze your resume for ATS compliance and impact."}</p>
              <button onClick={getAIOptimization} className="px-3 py-1.5 bg-blue-500 text-white text-xs font-bold rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Optimize Now
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Editor Area */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sections} strategy={verticalListSortingStrategy}>
              {sections.map((section) => (
                <SortableSection key={section.id} id={section.id} onRemove={() => setSections(s => s.filter(x => x.id !== section.id))}>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">{section.type}</h3>
                  
                  {section.id === 'personal' && (
                    <div className="space-y-3">
                      <input value={personal.name} onChange={e => setPersonal({...personal, name: e.target.value})} className="w-full bg-black/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-white" placeholder="Full Name" />
                      <input value={personal.role} onChange={e => setPersonal({...personal, role: e.target.value})} className="w-full bg-black/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-white" placeholder="Target Role" />
                      <div className="grid grid-cols-2 gap-3">
                        <input value={personal.email} onChange={e => setPersonal({...personal, email: e.target.value})} className="w-full bg-black/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-white" placeholder="Email" />
                        <input value={personal.phone} onChange={e => setPersonal({...personal, phone: e.target.value})} className="w-full bg-black/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-white" placeholder="Phone" />
                        <input value={personal.linkedin} onChange={e => setPersonal({...personal, linkedin: e.target.value})} className="w-full bg-black/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-white" placeholder="LinkedIn" />
                        <input value={personal.github} onChange={e => setPersonal({...personal, github: e.target.value})} className="w-full bg-black/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-white" placeholder="GitHub" />
                      </div>
                    </div>
                  )}

                  {section.id === 'experience' && (
                    <div className="space-y-4">
                      {experiences.map(exp => (
                        <div key={exp.id} className="space-y-3 bg-black/20 p-3 rounded-lg border border-white/5">
                          <input value={exp.title} onChange={e => setExperiences(exps => exps.map(x => x.id === exp.id ? {...x, title: e.target.value} : x))} className="w-full bg-black/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-white" placeholder="Job Title" />
                          <div className="grid grid-cols-2 gap-3">
                            <input value={exp.company} onChange={e => setExperiences(exps => exps.map(x => x.id === exp.id ? {...x, company: e.target.value} : x))} className="w-full bg-black/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-white" placeholder="Company" />
                            <input value={exp.date} onChange={e => setExperiences(exps => exps.map(x => x.id === exp.id ? {...x, date: e.target.value} : x))} className="w-full bg-black/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-white" placeholder="Date (e.g. 2022 - 2024)" />
                          </div>
                          <textarea value={exp.desc} onChange={e => setExperiences(exps => exps.map(x => x.id === exp.id ? {...x, desc: e.target.value} : x))} className="w-full bg-black/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-white h-20 resize-none" placeholder="Description / Bullet points" />
                        </div>
                      ))}
                      <button onClick={() => setExperiences([...experiences, { id: Date.now().toString(), title: "", company: "", date: "", desc: "" }])} className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold flex items-center justify-center gap-2">
                        <Plus className="w-3 h-3" /> Add Experience
                      </button>
                    </div>
                  )}

                  {section.id === 'education' && (
                    <div className="space-y-4">
                      {educations.map(edu => (
                        <div key={edu.id} className="space-y-3 bg-black/20 p-3 rounded-lg border border-white/5">
                          <input value={edu.degree} onChange={e => setEducations(edus => edus.map(x => x.id === edu.id ? {...x, degree: e.target.value} : x))} className="w-full bg-black/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-white" placeholder="Degree" />
                          <div className="grid grid-cols-2 gap-3">
                            <input value={edu.school} onChange={e => setEducations(edus => edus.map(x => x.id === edu.id ? {...x, school: e.target.value} : x))} className="w-full bg-black/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-white" placeholder="School" />
                            <input value={edu.date} onChange={e => setEducations(edus => edus.map(x => x.id === edu.id ? {...x, date: e.target.value} : x))} className="w-full bg-black/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-white" placeholder="Date" />
                          </div>
                          <input value={edu.desc} onChange={e => setEducations(edus => edus.map(x => x.id === edu.id ? {...x, desc: e.target.value} : x))} className="w-full bg-black/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-white" placeholder="Additional Info (GPA, Honors)" />
                        </div>
                      ))}
                      <button onClick={() => setEducations([...educations, { id: Date.now().toString(), degree: "", school: "", date: "", desc: "" }])} className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold flex items-center justify-center gap-2">
                        <Plus className="w-3 h-3" /> Add Education
                      </button>
                    </div>
                  )}

                  {section.id === 'skills' && (
                    <textarea value={skills} onChange={e => setSkills(e.target.value)} className="w-full bg-black/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-white h-24 resize-none" placeholder="React, Python, Design..." />
                  )}

                </SortableSection>
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {/* Right Panel: Live Preview & Export */}
      <div className="flex-1 bg-black/40 p-8 flex flex-col items-center overflow-y-auto">
        <div className="w-full max-w-[800px] flex justify-end mb-4">
          <button onClick={() => handlePrint()} className="px-6 py-2 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 hover:bg-white/90 shadow-lg shadow-white/10 transition-all hover:scale-105 active:scale-95">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>

        {/* Rendered Resume (A4 Ratio) */}
        <div className="w-full max-w-[800px] bg-white text-black p-10 shadow-2xl overflow-hidden" ref={componentRef} style={{ minHeight: '1056px', fontFamily: "'Inter', sans-serif" }}>
          {sections.map(section => (
            <div key={section.id} className="mb-6">
              
              {section.id === 'personal' && (
                <div className="text-center border-b-2 border-black/10 pb-6 mb-6">
                  <h1 className="text-4xl font-black tracking-tight mb-2 text-zinc-900">{personal.name || "Your Name"}</h1>
                  <p className="text-lg text-zinc-600 font-medium mb-3">{personal.role}</p>
                  <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-zinc-500 font-medium">
                    {personal.email && <span>{personal.email}</span>}
                    {personal.phone && <span>• {personal.phone}</span>}
                    {personal.linkedin && <span>• {personal.linkedin}</span>}
                    {personal.github && <span>• {personal.github}</span>}
                  </div>
                </div>
              )}

              {section.id === 'experience' && experiences.length > 0 && (
                <div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-zinc-800 border-b border-black/10 pb-2 mb-4">Experience</h2>
                  <div className="space-y-4">
                    {experiences.map(exp => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="text-base font-bold text-zinc-900">{exp.title}</h3>
                          <span className="text-xs font-semibold text-zinc-500">{exp.date}</span>
                        </div>
                        <p className="text-sm font-semibold text-blue-600 mb-2">{exp.company}</p>
                        <p className="text-sm text-zinc-700 whitespace-pre-wrap leading-relaxed">{exp.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {section.id === 'education' && educations.length > 0 && (
                <div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-zinc-800 border-b border-black/10 pb-2 mb-4">Education</h2>
                  <div className="space-y-4">
                    {educations.map(edu => (
                      <div key={edu.id}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="text-base font-bold text-zinc-900">{edu.school}</h3>
                          <span className="text-xs font-semibold text-zinc-500">{edu.date}</span>
                        </div>
                        <p className="text-sm font-semibold text-zinc-800 mb-1">{edu.degree}</p>
                        <p className="text-sm text-zinc-600">{edu.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {section.id === 'skills' && skills && (
                <div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-zinc-800 border-b border-black/10 pb-2 mb-4">Skills</h2>
                  <p className="text-sm text-zinc-700 leading-relaxed">{skills}</p>
                </div>
              )}

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
