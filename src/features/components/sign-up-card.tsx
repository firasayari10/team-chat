import {Card , 
    CardHeader , 
    CardDescription , 
    CardContent,
CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {FcGoogle  } from  "react-icons/fc";
import {FaGithub } from  "react-icons/fa";
import { SignInFlow } from "../types";
import {TriangleAlert} from "lucide-react";
import {useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

interface SignUpCardProps  {
    setState: (state:SignInFlow) => void ;

};
export const SignUpCard = ({setState}:SignUpCardProps) => {
    const [name , setName] = useState(""); 
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");
    const [confirmpassword , setConfirmPassword] = useState("");
    const [error, setError]= useState("");
    const [pending , setPending]= useState(false);
    const { signIn } = useAuthActions();

    const onPasswordsSignUp = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(password !== confirmpassword) {
            setError("passwords Need to be identical !");
            return
        }
        setPending(true);
        signIn("password",{name ,email , password , flow:"signUp"})
        .catch(()=> {
            setError("something  went wrong ! ")
        })
        .finally(()=> { setPending(false)})

    }
    const handleProiderSignUp =(value: "github"|"google") => {
            setPending(true),
            signIn(value)
            .finally(()=> {
                setPending(false)

            })
        }
    return (
        <Card className="w-full h-full p-8"> 
        <CardHeader className="px-0 pt-0">
            <CardTitle> Sign Up to continue </CardTitle> 
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
                <form className="space-y-2.5" onSubmit={onPasswordsSignUp}>
                    <Input 
                    disabled={pending}
                    value={name}
                    onChange={(e)=>{setName(e.target.value)}} 
                    placeholder="Name"
                    
                    required/>
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
                    <Input 
                    disabled={pending}
                    value={confirmpassword}
                    onChange={(e)=>{setConfirmPassword(e.target.value)}} 
                    placeholder=" Confirm Password"
                    type="password"
                    required/>
                    <Button type="submit" disabled={pending} size="lg" className="w-full">
                            Continue
                    </Button>
                </form>

                <Separator className="my-5 bg-gray-600" />

                <div className="flex flex-col gap-y-3">
                    <Button  disabled={false} onClick={()=>handleProiderSignUp("google")} variant="outline" size="lg" className="w-full relative ">
                        <FcGoogle className="size-5 absolute top-3  left-2.5 " />
                        Continue with Google 
                    </Button>
                    <Button  onClick={()=>handleProiderSignUp("github")} variant="outline" size="lg" className="w-full relative">
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