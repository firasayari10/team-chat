
"use client"

import {Button} from "@/components/ui/button"
import {useAuthActions} from "@convex-dev/auth/react"
import AuthPage from "./auth/page";
import {AuthScreen} from"@/features/components/auth.screen"
export default function Home() {

  const { signOut} =useAuthActions();
  return ( 
    
    <div>
      logged in !!
      <Button onClick={()=>{signOut()}}>
        log out 
      </Button>

      
    </div>
    
    
  
  )
}
