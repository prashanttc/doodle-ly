import React from 'react'
import { Button } from './ui/button';

const DownloadButton = ({aiImageUrl}:{aiImageUrl:string}) => {

  return (
    <Button
    className='bg-white cursor-pointer'
    onClick={() => {
      if (!aiImageUrl) return;
      const link = document.createElement("a");
      link.href = aiImageUrl;
      link.setAttribute("download", "ai-generated-image.webp");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }}
  >
    Download Image
  </Button>
  
  )
}

export default DownloadButton
