import React from 'react'
import Wallet from '@/components/OrganizerProfile/wallet'
import OrganizerLayout from '@/components/OrganizerProfile/Common/OrganizerLayout'

function page() {
  return (
    <OrganizerLayout>
    <div className='bg-[#1F1F1F]'>
      <Wallet />
    </div>
    </OrganizerLayout>
  )
}

export default page
