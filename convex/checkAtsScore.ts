import { mutation } from "./_generated/server";
import { v } from "convex/values";
import axios from "axios";
import * as cheerio from 'cheerio';

export const CheckATsScore = mutation({
    args:{
        jobUrl: v.string(),
        resumeText: v.string(),
    },
    handler: async(ctx,args) => {
        const { jobUrl , resumeText } =args;

        const jobDesc = await ScrapeJobDescription(jobUrl);
        if(!jobDesc) throw new Error("failed to scrape job desciption");

        const score = computeScore(resumeText , jobDesc);

        return {
            score,
            jobDescSnippet:jobDesc.slice(0,500),
        }
    }
})

async function ScrapeJobDescription(url:string):Promise<string | null> {
    try{
      const { data } = await axios.get(url);
      const $ =cheerio.load(data);
      const text = $("section, .job-description, #job-details, .description").text() || $("body").text();
      return text.replace(/\s+/g," ").trim();
    }catch(e){
      console.error("Scraping failed:", e);
     return null;
    }
}

function computeScore(resume: string, job: string): number {
  const resumeWords = new Set(resume.toLowerCase().split(/\W+/));
  const jobWords = job.toLowerCase().split(/\W+/);
  const matched = jobWords.filter((w) => resumeWords.has(w));
  return Math.min(100, Math.floor((matched.length / jobWords.length) * 100));
}