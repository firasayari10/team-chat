import {Card , 
    CardHeader , 
    CardDescription , 
    CardContent,
CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Separator} from "@/components/ui/separator"
import {FcGoogle  } from  "react-icons/fc"
import {FaGithub } from  "react-icons/fa"
import { SignInFlow } from "../types"

import {useState } from "react"

interface SignUpCardProps  {
    setState: (state:SignInFlow) => void ;

};
export const SignUpCard = ({setState}:SignUpCardProps) => {
        
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");
    const [confirmpassword , setConfirmPassword] = useState("");

    return (
        <Card className="w-full h-full p-8"> 
        <CardHeader className="px-0 pt-0">
            <CardTitle> Sign Up to continue </CardTitle> 
            <CardDescription>
            use your email or another service to continue
        </CardDescription>
        </CardHeader>
        
            <CardContent className="sapce-y-5 px-0 pb-0" >
                <form className="space-y-2.5">
                    <Input 
                    disabled={false}
                    value="email"
                    onChange={(e)=>{setEmail(e.target.value)}} 
                    placeholder="Email"
                    type="email"
                    required/>
                    <Input 
                    disabled={false}
                    value="password"
                    onChange={(e)=>{setPassword(e.target.value)}} 
                    placeholder="Password"
                    type="password"
                    required/>
                    <Input 
                    disabled={false}
                    value="confirmpassword"
                    onChange={(e)=>{setConfirmPassword(e.target.value)}} 
                    placeholder=" Confirm Password"
                    type="password"
                    required/>
                    <Button type="submit" disabled={false} size="lg" className="w-full">
                            Continue
                    </Button>
                </form>

                <Separator className="my-5 bg-gray-600" />

                <div className="flex flex-col gap-y-3">
                    <Button  disabled={false} onClick={()=>{}} variant="outline" size="lg" className="w-full relative ">
                        <FcGoogle className="size-5 absolute top-3  left-2.5 " />
                        Continue with Google 
                    </Button>
                    <Button  onClick={()=>{}} variant="outline" size="lg" className="w-full relative">
                        <FaGithub  className="size-5 absolute  top-3  left-2.5  " />
                        Continue with Github
                    </Button>

                </div>
                <br />
                <p className="text-xs text-muted-foreground">
                    already have an accout ?
                    <span onClick={()=>setState("signIn")} className="text-sky-700 hover:underline cursor-pointer ">
                        Sign In
                    </span>

                </p>

            </CardContent>
        </Card>
    )
}