import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Project } from "../types";
import { Link } from "react-router-dom";
import {  ArrowBigDownDashIcon, EyeIcon, EyeOffIcon, FullscreenIcon, LaptopIcon, Loader2Icon, MessageSquareIcon, SaveIcon, Smartphone, TabletIcon, XIcon } from "lucide-react";
import { dummyConversations, dummyProjects, dummyVersion } from "../assets/assets";
import favicon from '../assets/favicon.svg'
import Sidebar from "../components/Sidebar";
import ProjectPreview, { type ProjectPreviewRef } from "../components/ProjectPreview";
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
  const [isSaving, setisSaving] = React.useState(false);

  const previewRef=React.useRef<ProjectPreviewRef>(null)
  const fetchProject = async () => {
    const project=dummyProjects.find((p) => p.id === projectId) || null;
    setTimeout(() => {
      if(project){
        setProject({...project,conversation:dummyConversations,versions: dummyVersion});
        setLoading(false);
        setIsGenerating(project.current_code ? false : true);
      }
    },2000)
  };
  const togglePublish=async()=>{
    if(project?.isPublished){
      setProject({...project,isPublished:false});
    }else{
      setProject({...project,isPublished:true});
    }
  }
  const downloadCode=()=>{
    const code=previewRef.current?.getCode() || project?.current_code
    if(!code){
      if(isGenerating) return;
      return;
    }
    const element=document.createElement('a')
    const file=new Blob([code],{type:'text/html'})
    element.href=URL.createObjectURL(file)
    element.download="index.html"
    document.body.appendChild(element)
    element.click();
  }
  const saveProject=async()=>{}
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
          <p className="text-sm font-medium capitalize truncate">{project.name}</p>
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
        <button onClick={()=>saveProject()} disabled={isSaving} className="max-sm:hidden bg-gray-800 hover:bg-gray-700 text-white px-3.5 py-1 flex items-center gap-2 rounded sm:rounded-sm transition-colors border border-gray-700">
          {isSaving ? <Loader2Icon className="size-4 animate-spin"/> : <SaveIcon size={16} />}
          Save
        </button>
        <Link className="flex items-center gap-2 px-4 py-1 rounded sm:rounded-sm border border-gray-700 hover:border-gray-500 transition-colors" target="_blank" to={`/preview/${projectId}`}><FullscreenIcon size={16}/> Preview</Link>
        <button onClick={()=>downloadCode()} className="bg-linear-to-br from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white px-3.5 py-1 flex items-center gap-2 rounded sm:rounded-sm transition-colors"> <ArrowBigDownDashIcon size={16}/>Download</button>
        <button onClick={()=>togglePublish()} className="bg-linear-to-br from-indigo-700 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 text-white px-3.5 py-1 flex items-center gap-2 rounded sm:rounded-sm transition-colors"> 
          {project.isPublished ? <EyeOffIcon size={16}/> : <EyeIcon size={16}/>}
          {
            project.isPublished ? "Unpublish" : "Publish"
          }
          </button>
      </div>
    </div>
    <div className="flex-1 flex overflow-auto">
      <Sidebar isMenuOpen={isMenuOpen} project={project} setProject={(p)=>setProject(p)} isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}/>
      <div className="flex-1 p-2 pl-0">
        <ProjectPreview  ref={previewRef} project={project} isGenerating={isGenerating} device={device}/>
      </div>
    </div>
  </div>
  ):
  (
  <div className="flex items-center justify-center h-screen">
    <p className="text-2xl font-medium text-gray-200">Unable to load Project!</p>
  </div>
  )
};

export default Projects;
