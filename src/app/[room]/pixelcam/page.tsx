import React from 'react'
import PixelCam from './components/Cam'
import { Id } from '../../../../convex/_generated/dataModel'

async function Page({ params}: {params: Promise<{ room: string }>}) {
    const p = await params
  return (
    <div>
        <PixelCam room={p.room }/>
    </div>
  )
}

export default Page