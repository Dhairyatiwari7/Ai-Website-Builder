import React, { useEffect } from "react";
import type { Project } from "../types";
import { Loader2Icon, PlusIcon, TrashIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import api from "@/configs/axios";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const MyProjects = () => {
  const {data: session,isPending}=authClient.useSession()
  const [loading, setLoading] = React.useState(true);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const navigate = useNavigate();

  const deleteProject = async (projectId: string) => {
    try {
      const confirm=window.confirm('Are you sure you want to delete thsi project')
      if(!confirm) return;
      const {data}=await api.delete(`/api/project/${projectId}`)
      toast.success(data.message)
      fetchProjects()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "An error occurred while deleting projects");
      console.error(error);
    }
  }
  const fetchProjects = async () => {
        try {
          setLoading(true);
          const { data } = await api.get("/api/user/projects");
          if (!data) {
            toast.error("Failed to load projects");
          }
          setProjects(data.projects);
        } catch (error : any) {
          toast.error(error?.response?.data?.message || "An error occurred while loading Projects.");
          console.error(error);
        } finally {
          setLoading(false);
        }
  }

  useEffect(() => {
      if(session?.user && !isPending){
        fetchProjects();
      }
      else if(!isPending && !session?.user){
        navigate('/')
        toast.message('Please Login to view your message')
      }
  }, [session.user]);

  return (
    <div className="px-4 md:px-16 lg:px-24 xl:px-32">
      {loading ? (
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2Icon className="size-7 animate-spin text-indigo-400" />
        </div>
      ) : projects.length > 0 ? (
        <div className="py-10 min-h-[80vh]">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-2xl font-medium text-white">My Projects</h1>

            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-white px-6 py-2 rounded-lg 
                        bg-gradient-to-r from-indigo-500 to-purple-600 
                        hover:opacity-90 hover:scale-105 
                        active:scale-95 transition-all shadow-md"
            >
              <PlusIcon size={18} /> Create Now
            </button>
          </div>

          {/* Projects Grid */}
          <div className="flex flex-wrap gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`)}
                className="relative group w-72 max-sm:mx-auto cursor-pointer 
                          bg-gray-900/70 border border-gray-700 
                          rounded-xl overflow-hidden 
                          shadow-md 
                          hover:shadow-2xl hover:shadow-indigo-600/40
                          hover:-translate-y-2 hover:scale-[1.02]
                          hover:border-indigo-500/80
                          transition-all duration-300
                          flex flex-col h-[380px]"
              >
                {/* Preview */}
                <div className="relative w-full h-40 bg-gray-900 overflow-hidden border-b border-gray-800">
                  {project.current_code ? (
                    <iframe
                      srcDoc={project.current_code}
                      style={{ transform: "scale(0.25)" }}
                      sandbox="allow-scripts allow-same-origin"
                      className="absolute top-0 left-0 w-[1200px] h-[800px] origin-top-left pointer-events-none"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No Preview
                    </div>
                  )}
                </div>

                {/* Content */}
                <div
                  className="p-4 text-white flex flex-col flex-1
                                bg-gradient-to-b from-transparent 
                                group-hover:from-indigo-950/40 
                                transition-all duration-300"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium line-clamp-2">
                        {project.name}
                      </h2>

                      <span
                        className="px-2.5 py-0.5 mt-1 ml-2 text-xs 
                                      bg-gray-800 border border-gray-700 
                                      rounded-full"
                      >
                        Website
                      </span>
                    </div>

                    <p className="text-gray-400 mt-1 text-sm line-clamp-2">
                      {project.initial_prompt}
                    </p>
                  </div>

                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex justify-between items-center 
                               border-t border-gray-800 pt-4 mt-auto"
                  >
                    <span className="text-xs text-gray-500">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>

                    <div className="flex gap-3 text-white text-sm">
                      <button
                        onClick={() => navigate(`/preview/${project.id}`)}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 
                                  rounded-md transition-all"
                      >
                        Preview
                      </button>

                      <button
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 
                                  rounded-md transition-all"
                      >
                        Open
                      </button>
                    </div>
                  </div>
                </div>

                {/* Delete Icon */}
                <div onClick={(e) => e.stopPropagation()}>
                  <TrashIcon
                    onClick={() => deleteProject(project.id)}
                    className="absolute top-3 right-3 scale-0 
                               group-hover:scale-100 
                               bg-white p-1.5 size-7 
                               rounded text-red-500 
                               cursor-pointer 
                               transition-all"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <h1 className="text-3xl font-semibold text-gray-300">
            You have no Projects yet
          </h1>

          <button
            onClick={() => navigate("/")}
            className="text-white px-5 py-2 mt-5 rounded-md 
                       bg-indigo-500 hover:bg-indigo-600 
                       hover:scale-105 active:scale-95 
                       transition-all"
          >
            Create Now
          </button>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default MyProjects;
