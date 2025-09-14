import {SignInCard} from "@/features/components/sign-in-card" 
import {SignInFlow} from "@/features/types"
import {SignUpCard} from "@/features/components/sign-up-card"
import { useState } from "react"
export const AuthScreen = ()=> {
    const [state, setState] = useState<SignInFlow>("signIn");

    return (
        
        
        <div className="h-full flex items-center justfy-center bg-[#5C3B58]">

            <div className="md:h-auto md:w-[420px]">
                {state === "signIn" ? <SignInCard /> : <SignUpCard/>}

            </div>
        </div>
    )
}