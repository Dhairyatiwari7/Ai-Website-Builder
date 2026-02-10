import { useState ,useEffect} from "react"
import { useParams } from "react-router-dom";
import { Loader2Icon } from "lucide-react";
import ProjectPreview from "../components/ProjectPreview";
import type { Project, Version } from "../types";
import {toast} from 'sonner'
import api from "@/configs/axios";
import { authClient } from "@/lib/auth-client";
const Preview = () => {
  const [code,setCode]=useState("");
  const [loading,setLoading]=useState(true);
  const {projectId,versionId}=useParams();
  const {data: session,isPending}=authClient.useSession()
  const fetchCode=async()=>{
    try {
      setLoading(true)
      const {data}=await api.get(`/api/project/preview/${projectId}`)
      setCode(data.project.current_code)
      if(versionId){
        data.project.versions.forEach((version : Version)=>{
          if(version.id==versionId){
            setCode(version.code)
          }
        })
      }
      setLoading(false)
    } catch (error : any) {
      setLoading(false)
      toast.error(error?.response?.data?.message || "An error occurred while loading project for preview");
      console.error(error);
    }
  }
  useEffect(()=>{
    if(session?.user && !isPending){
      fetchCode();
    }
  },[session?.user])
  if(loading){
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2Icon className="size-7 animate-spin text-indigo-200"/>
      </div>
    )
  }
  return (
    <div className="h-screen">
      {code && <ProjectPreview project={{current_code: code} as Project } isGenerating={false} showEditorPanel={false}/>}
    </div> 
  )
}

export default Preview