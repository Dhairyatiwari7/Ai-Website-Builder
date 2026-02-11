import React from 'react'
import { appPlans } from '../assets/assets';
import Footer from '../components/Footer';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import api from '@/configs/axios';

interface Plan {
  id: string;
  name: string;
  price: string;
  credits: number;
  description: string;
  features: string[];
}

const Pricing = () => {
  const {data: session}=authClient.useSession()
  const [plans] = React.useState<Plan[]>(appPlans);

  const handlePurchase = async (planId: string) => {
    try {
      if(!session?.user){
        return toast.error('Please Login to purchase credit')
      }
      const {data}=await api.post('/api/user/purchase',{ planId });
      window.location.href=data.payment_link;
    } catch (error: any) {
      console.error('Purchase initiation failed:', error);
      toast.error('Failed to initiate purchase. Please try again.');
    }
  }

  return (
    <>
      <div className='w-full max-w-5xl mx-auto z-20 max-md:px-4 min-h-[80vh]'>

        {/* Header */}
        <div className='text-center mt-16'>
          <h2 className='text-gray-100 text-xl font-medium'>
            Choose Your Plan
          </h2>

          <p className='text-gray-400 text-sm max-w-md mx-auto mt-2'>
            Start for free and scale up as you grow. Find the perfect plan for your content selection needs.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className='pt-14 py-4 px-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>

            {plans.map((plan, idx) => (
              <div
                key={idx}
                className="group relative p-6 
             bg-black/40 backdrop-blur-xl
             border border-white/15
             mx-auto w-full max-w-sm 
             rounded-xl text-white 
             shadow-lg cursor-pointer
             
             hover:-translate-y-3 
             hover:scale-[1.03]
             hover:border-indigo-400
             hover:shadow-indigo-500/40
             hover:shadow-2xl
             
             transition-all duration-300"
              >
                <h3 className="text-xl font-bold group-hover:text-indigo-400 transition-colors">
                  {plan.name}
                </h3>

                <div className="my-3">
                  <span className="text-4xl font-bold">
                    {plan.price}
                  </span>
                  <span className="text-gray-300">
                    {" "} / {plan.credits} credits
                  </span>
                </div>

                <p className="text-gray-400 mb-6">
                  {plan.description}
                </p>

                <ul className="space-y-2 mb-6 text-sm">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <svg
                        className="h-5 w-5 text-indigo-400 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>

                      <span className="text-gray-400 group-hover:text-gray-200 transition-colors">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePurchase(plan.id)}
                  className="w-full py-2.5 px-4 
                             bg-indigo-500 
                             hover:bg-indigo-600 
                             active:scale-95 
                             text-sm rounded-md 
                             shadow-md hover:shadow-indigo-500/40
                             transition-all"
                >
                  Buy Now
                </button>
              </div>
            ))}

          </div>
        </div>

        <p className='mx-auto text-center text-sm max-w-md mt-10 text-white/60 font-light'>
          Project <span className='text-white'>Creation / Revision</span> consume
          <span className='text-white'> 5 credits</span>.
          You can purchase more credits to create more projects.
        </p>

      </div>

      <Footer />
    </>
  )
}

export default Pricing;
