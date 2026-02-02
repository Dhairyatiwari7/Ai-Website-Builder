import React, { useEffect } from 'react'
import type { Project } from '../types';
import { Loader2Icon, PlusIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dummyProjects } from '../assets/assets';

const MyProjects = () => {
  const [loading, setLoading] = React.useState(true);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const Navigate = useNavigate();
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
    <>
      <div className='px-4 md:px-16 lg-px:24 xl-px:32'>
        {loading ? (
          <div className='flex items-center justify-center h-[80vh]'>
            <Loader2Icon className='size-7 animate-spin text-indigo-200' size={40} />
          </div>
        ) : projects.length > 0 ? (
          <div className='py-10 min-h-[80vh]'>
            <div className='flex items-center justify-between mb-12'>
              <h1 className='text-2xl font-medium text-white'>My Projects</h1>
              <button
                onClick={() => Navigate('/')}
                className="flex items-center gap-2 text-white px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 active:scale-95 transition-all shadow-md"
              >
                <PlusIcon size={18} /> Create Now
              </button>
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center h-[80vh]'>
            <h1 className='text-3xl font-semibold text-gray-300'>You have no Projects yet</h1>
            <button onClick={() => { Navigate('/') }} className='text-white px-5 py-2 mt-5 rounded-md bg-indigo-500 hover:bg-indigo-600 active:scale-95 transition-all'>Create Now</button>
          </div>
        )}
      </div>
    </>
  )
}

export default MyProjects