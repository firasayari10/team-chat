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
import { SignInFlow } from "../../types"
import { useState } from "react"
import {TriangleAlert} from "lucide-react"

import { useAuthActions } from "@convex-dev/auth/react";

interface SignInCardProps  {
    setState: (state:SignInFlow) => void ;

};
export const SignInCard = ({setState}:SignInCardProps) => {
    const { signIn } = useAuthActions();
    
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");
    const [error, setError]= useState("");
    const [pending , setPending]= useState(false);
    const onPasswordSignIn =(e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPending(true);
        signIn("password", {email , password , flow: "signIn"})
        .catch(()=>{
            setError("Invalid email or password ")
        })
        .finally(()=> {
            setPending(false);
        });

    };
    const handleProiderSignIn =(value: "github"|"google") => {
        setPending(true),
        signIn(value)
        .finally(()=> {
            setPending(false)

        })
    }

    return (
        <Card className="w-full h-full p-8"> 
        <CardHeader className="px-0 pt-0">
            <CardTitle> Login to continue</CardTitle> 
            <CardDescription>
            use your email or another service to continue
        </CardDescription>
        </CardHeader>
        {!!error && ( 
            <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x2 text-destructive mb-2">
                <TriangleAlert className="size-4" />
                <p>{error}</p>
            </div>
        )}
           <CardContent className="sapce-y-5 px-0 pb-0" >
                <form className="space-y-2.5" onSubmit={onPasswordSignIn}>
                    <Input 
                    disabled={pending}
                    value={email}
                    onChange={(e)=>{setEmail(e.target.value)}} 
                    placeholder="Email"
                    type="email"
                    required/>
                    <Input 
                    disabled={pending}
                    value={password}
                    onChange={(e)=>{setPassword(e.target.value)}} 
                    placeholder="Password"
                    type="password"
                    required/>
                    <Button type="submit" disabled={pending} size="lg" className="w-full">
                            Continue
                    </Button>
                </form>

                <Separator className="my-5 bg-gray-600" />

                <div className="flex flex-col gap-y-3">
                    <Button  disabled={pending} onClick={()=>handleProiderSignIn("google")} variant="outline" size="lg" className="w-full relative ">
                        <FcGoogle className="size-5 absolute top-3  left-2.5 " />
                        Continue with Google 
                    </Button>
                    <Button  onClick={() =>handleProiderSignIn("github")} variant="outline" size="lg" className="w-full relative">
                        <FaGithub  className="size-5 absolute  top-3  left-2.5  " />
                        Continue with Github
                        
                        
                    </Button>

                </div>
                <br />
                <p className="text-xs text-muted-foreground">
                    Don&apos;t have an account ?
                    <span onClick={()=>setState("signUp")} className="text-sky-700 hover:underline cursor-pointer ">
                        Sign Up
                    </span>

                </p>

           </CardContent>
        </Card>
    )
}