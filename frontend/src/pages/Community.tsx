import React, { useEffect } from 'react'
import type { Project } from '../types';
import { Loader2Icon, } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { dummyProjects } from '../assets/assets';
import Footer from '../components/Footer';

const Community = () => {
  const [loading, setLoading] = React.useState(true);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setProjects(dummyProjects);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className='px-4 md:px-16 lg:px-24 xl:px-32'>

      {loading ? (
        <div className='flex items-center justify-center h-[80vh]'>
          <Loader2Icon className='size-7 animate-spin text-indigo-400' />
        </div>
      ) : projects.length > 0 ? (

        <div className='py-10 min-h-[80vh]'>

          <div className='flex items-center justify-between mb-12'>
            <h1 className='text-2xl font-medium text-white'>Published Projects</h1>
          </div>

          <div className='flex flex-wrap gap-6'>

            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/view/${project.id}`}
                target='_blank'
                className="relative group w-72 max-sm:mx-auto cursor-pointer 
                          bg-gray-900/70 border border-gray-700 
                          rounded-xl overflow-hidden 
                          hover:shadow-2xl 
                          hover:-translate-y-2 hover:scale-[1.02]
                          hover:border-indigo-500/80
                          transition-all duration-300
                          flex flex-col h-[380px]"
              >

                <div className='relative w-full h-40 bg-gray-900 overflow-hidden border-b border-gray-800'>
                  {project.current_code ? (
                    <iframe
                      srcDoc={project.current_code}
                      style={{ transform: 'scale(0.25)' }}
                      sandbox='allow-scripts allow-same-origin'
                      className='absolute top-0 left-0 w-[1200px] h-[800px] origin-top-left pointer-events-none'
                    />
                  ) : (
                    <div className='flex items-center justify-center h-full text-gray-500'>
                      No Preview
                    </div>
                  )}
                </div>
                <div className='p-4 text-white flex flex-col flex-1
                                bg-gradient-to-b from-transparent 
                                group-hover:from-indigo-950/40 
                                transition-all duration-300'>

                  <div>
                    <div className='flex items-start justify-between'>
                      <h2 className='text-lg font-medium line-clamp-2'>
                        {project.name}
                      </h2>

                      <span className='px-2.5 py-0.5 mt-1 ml-2 text-xs 
                                      bg-gray-800 border border-gray-700 
                                      rounded-full'>
                        Website
                      </span>
                    </div>

                    <p className='text-gray-400 mt-1 text-sm line-clamp-2'>
                      {project.initial_prompt}
                    </p>
                  </div>

                  <div
                    className='flex justify-between items-center 
                              border-t border-gray-800 pt-4 mt-auto'
                  >
                    <span className='text-xs text-gray-500'>
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>

                    <div className='flex gap-3 text-white text-sm'>
                      <button
                        className='px-3 py-1.5 bg-white/10 hover:bg-white/20 
                          rounded-md transition-colors flex items-center gap-2'
                      >
                        <span className='bg-gray-200 w-5 h-5 rounded-full text-black font-semibold 
                          flex items-center justify-center text-xs'>
                          {project.user?.name?.slice(0, 1)}
                        </span>

                        {project.user?.name}
                      </button>
                    </div>

                  </div>

                </div>

              </Link>
            ))}

          </div>
        </div>

      ) : (
        <div className='flex flex-col items-center justify-center h-[80vh]'>
          <h1 className='text-3xl font-semibold text-gray-300'>
            You have no Projects yet
          </h1>

          <button
            onClick={() => navigate('/')}
            className='text-white px-5 py-2 mt-5 rounded-md 
                       bg-indigo-500 hover:bg-indigo-600 
                       hover:scale-105 active:scale-95 
                       transition-all'
          >
            Create Now
          </button>
        </div>
      )}
      <Footer />
    </div>
  )
}


export default Community