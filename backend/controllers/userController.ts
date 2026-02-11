import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import openai from "../configs/openAi.js";
import Stripe from 'stripe'
import 'dotenv/config';
export const getUserCredits = async (req: Request, res: Response) => {
    const userId = req.userId
    try {
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized request!" })
        }
        const User = await prisma.user.findUnique({
            where: { id: userId }
        })
        if (!User) {
            return res.status(400).json({ message: "Invalid User Id" })
        }
        return res.status(200).json({ credit: User?.credits })
    } catch (error: any) {
        console.log(error.code || error.message)
        return res.status(500).json({ message: "Something went Wrong!" })
    }
}

export const createNewProject = async (req: Request, res: Response) => {
    const userId = req.userId;

    try {
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized request!" });
        }

        const User = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!User) {
            return res.status(400).json({ message: "Invalid User Id" });
        }

        const { initial_prompt } = req.body;

        if (!initial_prompt) {
            return res.status(400).json({ message: "Initial prompt is required" });
        }

        if (User.credits < 5) {
            return res.status(403).json({ message: "Add Credits to create more projects" });
        }

        const project = await prisma.websiteProject.create({
            data: {
                name:
                    initial_prompt.length > 50
                        ? initial_prompt.substring(0, 47) + "..."
                        : initial_prompt,
                initial_prompt,
                userId,
            }
        });

        await prisma.user.update({
            where: { id: userId },
            data: {
                totalCreation: { increment: 1 },
                credits: { decrement: 5 }
            }
        });

        await prisma.conversation.create({
            data: {
                role: "user",
                content: initial_prompt,
                projectId: project.id
            }
        });

        res.status(200).json({ projectId: project.id });

        (async () => {
            try {

                const promptEnhancedResponse =
                    await openai.chat.completions.create({
                        model: "z-ai/glm-4.5-air:free",
                        messages: [
                            {
                                role: "system",
                                content: `
You are a prompt enhancement specialist.
Return ONLY the enhanced prompt.
`
                            },
                            {
                                role: "user",
                                content: initial_prompt
                            }
                        ]
                    });

                const enhancedPrompt =
                    promptEnhancedResponse.choices[0].message?.content || "";

                await prisma.conversation.create({
                    data: {
                        role: "assistant",
                        content: `I enhanced your prompt to "${enhancedPrompt}"`,
                        projectId: project.id
                    }
                });

                await prisma.conversation.create({
                    data: {
                        role: "assistant",
                        content: "Now generating your website...",
                        projectId: project.id
                    }
                });

                const codeGeneratedResponse =
                    await openai.chat.completions.create({
                        model: "z-ai/glm-4.5-air:free",
                        messages: [
                            {
                                role: "system",
                                content: `
Return ONLY valid HTML using Tailwind CSS.
No markdown. No explanations.
`
                            },
                            {
                                role: "user",
                                content: enhancedPrompt
                            }
                        ]
                    });

                const code =
                    codeGeneratedResponse.choices[0].message.content || "";
                if (!code || code.trim() === '') {
                    await prisma.conversation.create({
                        data: {
                            role: 'assistant',
                            content: "Unable to generate code, please try again",
                            projectId: project.id
                        }

                    })
                    await prisma.user.update({
                        where: { id: userId },
                        data: {
                            credits: { increment: 5 }
                        }
                    })
                    return;
                }
                const cleanedCode = code
                    .replace(/```[a-z]*\n?/gi, "")
                    .replace(/'''$/g, "")
                    .trim();

                const version = await prisma.version.create({
                    data: {
                        code: cleanedCode,
                        description: "Initial Version",
                        projectId: project.id
                    }
                });

                await prisma.conversation.create({
                    data: {
                        role: "assistant",
                        content:
                            "I've created your website! You can preview it now.",
                        projectId: project.id
                    }
                });

                await prisma.websiteProject.update({
                    where: { id: project.id },
                    data: {
                        current_code: cleanedCode,
                        current_version_index: version.id
                    }
                });

            } catch (bgError) {
                console.error("Background generation failed:", bgError);
                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        credits: { increment: 5 }
                    }
                });
            }
        })();

    } catch (error: any) {
        console.log(error);

        if (!res.headersSent) {
            return res.status(500).json({
                message: "Something went wrong!"
            });
        }
    }
};


export const getUserProjectById = async (req: Request, res: Response) => {
    const userId = req.userId
    try {
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized request!" })
        }
        const { projectId } = req.params
        if (!projectId) {
            return res.status(400).json({ message: "Project Id is required!" })
        }
        const Project = await prisma.websiteProject.findUnique({
            where: { id: projectId, userId },
            include: {
                conversation: {
                    orderBy: {
                        timestamp: 'asc'
                    }
                },
                versions: {
                    orderBy: {
                        timestamp: 'asc'
                    }
                }
            }
        })
        if (!Project) {
            return res.status(404).json({ message: "Project not found!" })
        }
        return res.status(200).json({ project: Project })
    } catch (error: any) {
        console.log(error.code || error.message)
        return res.status(500).json({ message: "Something went Wrong!" })
    }
}
export const getUserProjects = async (req: Request, res: Response) => {
    const userId = req.userId
    try {
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized request!" })
        }
        const projects = await prisma.websiteProject.findMany({
            where: { userId },
            orderBy: {
                updatedAt: 'desc'
            }
        })
        if (!projects) {
            return res.status(404).json({ message: "No Projects found!" })
        }
        return res.status(200).json({ projects })
    } catch (error: any) {
        console.log(error.code || error.message)
        return res.status(500).json({ message: "Something went Wrong!" })
    }
}

export const toggleProjectPublishStatus = async (req: Request, res: Response) => {
    const userId = req.userId;
    try {
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized access" })
        }
        const { projectId } = req.params
        if (!projectId) {
            return res.status(401).json({ message: "Project Id is required" })
        }
        const project = await prisma.websiteProject.findUnique({
            where: { id: projectId, userId },
        })
        if (!project) {
            return res.status(401).json({ message: "Project Not found!" })
        }
        await prisma.websiteProject.update({
            where: { id: projectId, userId },
            data: { isPublished: !project.isPublished }
        })
        return res.status(200).json({ message: project.isPublished ? 'Project UnPublished' : 'Project Published Successfully!' })
    } catch (error: any) {
        console.log(error.code || error.message)
        return res.status(500).json({ message: "Something went Wrong!" })
    }
}

export const purchaseCredits = async (req: Request, res: Response) => {
    const userId = req.userId; 
    
    try {
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized request!" });
        }

        interface Plan {
            credits: number;
            amount: number;
        }

        const plans: Record<string, Plan> = {
            basic: { credits: 100, amount: 5 },
            pro: { credits: 400, amount: 19 },
            enterprise: { credits: 1000, amount: 49 }
        };

        const { planId } = req.body as { planId: string };
        
        if (!planId || !plans[planId as keyof typeof plans]) {
            return res.status(400).json({ message: "Invalid plan ID" });
        }

        const origin = req.headers.origin as string;
        const plan = plans[planId as keyof typeof plans];

        const transaction = await prisma.transaction.create({
            data: {
                userId: userId,
                planId: planId,
                amount: plan.amount,
                credits: plan.credits
            }
        });

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
        
        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/loading`,
            cancel_url: `${origin}/`,
            line_items: [
                {
                    price_data: {  
                        currency: 'usd',
                        product_data: {  
                            name: `AiSiteBuilder - ${plan.credits} credits`
                        },
                        unit_amount: plan.amount * 100  
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            metadata: {
                transactionId: transaction.id,
                appId: 'AI-Site-Builder'
            },
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
        });

        res.json({ payment_link: session.url });
    } catch (error: any) {
        console.error('Purchase error:', error);  
        return res.status(500).json({ 
            message: "Purchase failed. Please try again.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
