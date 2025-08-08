"use client"

import { useMutation } from "convex/react";
import { api } from '@/convex/_generated/api'
import { useState } from "react"
import { Button } from "./ui/button";

export default function ATSChecker() {
    const [jobUrl, setJobUrl] = useState("");
    const [resume , setResume] = useState("");
    const [result , setResult] = useState<null | { score: number; snippet: string}>(null);

    const checkScore = useMutation(api.checkAtsScore.CheckATsScore);

    const handleCheck = async () => {
        const res = await checkScore({jobUrl ,resumeText:resume});
        setResult({score: res.score , snippet: res.jobDescSnippet});
    }

    return (
        <div>
            <h2>ATS Score Checker</h2>
            <input
             type="text" 
             className="border px-2 py-1 mb-2 w-full"
             placeholder="Paste Job URL "
             value={jobUrl}
             onChange={(e) => setJobUrl(e.target.value)}/>
            <textarea 
             rows={6}
             className="border px-2 py-1 mb-2 w-full"
             placeholder="Paste your resume text here"
             value = {resume}
             onChange={(e) => setResume(e.target.value)}
            />
            <Button onClick={handleCheck}>
             Check Score
            </Button>
            {result && (
                <div className="mt-4">
                    <p className="text-lg"> Score: <strong>{result.score}/100</strong></p>
                    <p className="text-sm text-gray-500">Snippet of Job desciption: {result.snippet}</p>
                </div>
            )}
        </div>
    )
}