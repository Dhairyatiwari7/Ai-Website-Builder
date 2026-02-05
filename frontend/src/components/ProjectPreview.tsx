import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import type { Project } from '../types';
import { iframeScript } from '../assets/assets';
import EditorPanel from './EditorPanel';

interface ProjectPreviewProps{
    project : Project;
    isGenerating : boolean;
    device?: 'phone' | 'tablet' | 'desktop';
    showEditorPanel?: boolean
}
export interface ProjectPreviewRef{
    getCode: ()=>string | undefined;

};
const ProjectPreview = forwardRef<ProjectPreviewRef,ProjectPreviewProps>(({project,isGenerating,device='desktop',showEditorPanel=true},ref) => {
    const iframeRef=useRef<HTMLFrameElement>(null)
    const [selectedElement,setSelectedElement]=React.useState<any>(null)
    const handleUpdate=(updates:any)=>{
        if(iframeRef.current?.contentWindow){
            iframeRef.current.contentWindow.postMessage({
                type:'UPDATE_ELEMENT',
                payload: updates
            },'*')
        }
    }
    useEffect(()=>{
        const handleMessage=(event:MessageEvent)=>{
            if(event.data.type==='ELEMENT_SELECTED'){    
                setSelectedElement(event.data.payload)
            }
            else if(event.data.type==='CLEAR_SELECTION'){
                setSelectedElement(null)
            }
        }
        window.addEventListener('message',handleMessage)
        return ()=>{
            window.removeEventListener('message',handleMessage)
        }
    },[])
    const injectPreview=(html:string)=>{
        if(!html){
            return ""
        }
        if(!showEditorPanel) return html
        if(html.includes('<body>')){
            return html.replace('</body>',iframeScript+'</body>')
        }
        else{
            return html+iframeScript
        }
    }
    const resolutions={
        phone : 'w-[412px]',
        tablet : 'w-[768px]',
        desktop : 'w-full'
    }
    useImperativeHandle(ref,()=>({
        getCode: ()=>{
            const doc=iframeRef.current?.contentDocument;
            if(!doc){
                return undefined
            }
            doc.querySelectorAll('.ai-selected-element,[data-ai-selected]').forEach((ele)=>{
                ele.classList.remove('ai-selected-element');
                ele.removeAttribute('data-ai-selected');
                (ele as HTMLElement).style.outline=""
            })
            const previewStyle=doc.getElementById('ai-preview-style')
            if(previewStyle){
                previewStyle.remove()
            }
            const previewScript=doc.getElementById('ai-preview-script')
            if(previewScript){
                previewScript.remove()
            }
            const HTML=doc.documentElement.outerHTML;
            return HTML
        }
    }))
    return (
    <div className='relative h-full bg-gray-900 flex-1 rounded-xl overflow-hidden max-sm:ml-2'>
        {project.current_code ? (
            <>
            <iframe ref={iframeRef} srcDoc={injectPreview(project.current_code)}
            className={`h-full mx-sm:w-full ${resolutions[device]} mx-auto transition-all`}
            />
            {showEditorPanel && selectedElement && (
                <EditorPanel onUpdate={handleUpdate} onClose={()=>{
                    setSelectedElement(null);
                    if(iframeRef.current?.contentWindow){
                        iframeRef.current.contentWindow.postMessage({type:'CLEAR_SELECTION_REQUEST'},'*')
                    }
                }} selectedElement={selectedElement}/>
            )}
            </>
        ):
        isGenerating &&(
            <div>
                loading
            </div>
        )}
    </div>
    )
})

export default ProjectPreview