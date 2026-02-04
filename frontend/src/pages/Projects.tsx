import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Project } from "../types";
import { Link } from "react-router-dom";
import {  ArrowBigDown, ArrowBigDownDashIcon, EyeIcon, EyeOffIcon, FullscreenIcon, LaptopIcon, Loader2Icon, MessageSquareIcon, SaveIcon, Smartphone, TabletIcon, XIcon } from "lucide-react";
import { dummyConversations, dummyProjects } from "../assets/assets";
import favicon from '../assets/favicon.svg'
const Projects = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = React.useState<Project | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isGenerating, setIsGenerating] = React.useState(true);
  const [device, setDevice] = React.useState<"phone" | "tablet" | "desktop">(
    "desktop",
  );
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [issaving, setisSaving] = React.useState(false);
  const fetchProject = async () => {
    const project=dummyProjects.find((p) => p.id === projectId) || null;
    setTimeout(() => {
      if(project){
        setProject({...project,conversation:dummyConversations});
        setLoading(false);
        setIsGenerating(project.current_code ? false : true);
      }
    },2000)
  };
  useEffect(() => {
    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2Icon
          className="size-7 text-violet-200"
          style={{ animation: "spin 1s linear infinite" }}
        />

        <style>{`
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `}</style>
      </div>
    );
  }

  return project? (
  <div className="flex flex-col h-screen w-full bg-gray-900 text-white">
    <div className="flex max-sm:flex-col sm:items-center gap-4 px-4 py-2 border-b no-scrollbar">
      <div className="flex items-center gap-2 sm:min-w-90 text-nowrap">
        <img src={favicon} alt="logo" className="h-6 cursor-pointer" onClick={()=>navigate('/')}/>
        <div className="max-w-64 sm:max-w-xs">
          <p className="text-sm text-medium captalize truncate">{project.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">Previewing Latest Version</p>
        </div>
        <div className="sm:hidden flex-1 flex justify-end">
          {isMenuOpen ? <MessageSquareIcon onClick={() => setIsMenuOpen(false)} className="size-6 cursor-pointer"/>
          : <XIcon className="size-6 cursor-pointer" onClick={() => setIsMenuOpen(true)}/>}
        </div>
      </div>
      
      <div className="hidden sm:flex gap-2 bg-gray-950 p-1.5 rounded-md">
        <Smartphone className={`size-6 p-1 rounded cursor-pointer ${device === "phone" ? "bg-gray-700" : ""}`} onClick={() => setDevice("phone")} />
        
        <TabletIcon className={`size-6 p-1 rounded cursor-pointer ${device === "tablet" ? "bg-gray-700" : ""}`} onClick={() => setDevice("tablet")} />
        
        <LaptopIcon className={`size-6 p-1 rounded cursor-pointer ${device === "desktop" ? "bg-gray-700" : ""}`} onClick={() => setDevice("desktop")} />
      </div>

      <div className="flex items-center justify-end gap-3 flex-1 text-xs sm:text-sm">
        <button>
          <SaveIcon size={16} /> Save
        </button>
        <Link target="_blank" to={`/preview/${projectId}`}><FullscreenIcon size={16}/> Preview</Link>
        <button> <ArrowBigDownDashIcon size={16}/>Download</button>
        <button>
          {project.isPublished ? <EyeOffIcon size={16}/> : <EyeIcon size={16}/>}
          {
            project.isPublished ? "Unpublish" : "Publish"
          }
          </button>
      </div>
    </div>
  </div>):
  (
  <div className="flex items-center justify-center h-screen">
    <p className="text-2xl font-medium text-gray-200">Unable to load Project!</p>
  </div>
  )
};

export default Projects;
