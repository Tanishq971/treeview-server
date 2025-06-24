import { PrismaClient } from "@/generated/prisma"
import cron from "node-cron"

const prisma = new PrismaClient()

cron.schedule("0 * * * *" ,async ()=>{
    const threeHoursAgo = new Date(Date.now()- 3*60*60*1000)

    await prisma.fileTree.deleteMany({
        where:{
            createdAt:{
                lt:threeHoursAgo
            }
        }
    })

    console.log("files deleted ")
})