import pkg from '@prisma/client'
const { PrismaClient } = pkg
import { mtgs } from './MTG-api.js'

const prisma = new PrismaClient()
//rename some of it to MTG api loadUVUCourses to loadMtgs
// allCourses to AllRulings
// uvu_courses to ??????
/* async function loadMTG_Items() {
    //removed .course after ('mtgs').course because it doesn't work on MTG's api
    // 107:30 3/31 video preview original
//const allCourses = uvu_courses('mtgs')
return allCourses.map((crs) => {
    return {
        data: {
            name: crs.name,
            color: crs.color,
            rarity: crs.rarity,
            text: crs.text,
            imageUrl: crs.imageUrl
        }
    } 
})
} */

async function main() {

    const simplifiedMTG_Items = mtgs.map(item => {
        return {
            data: {
                name: item.name,
                color: item.color,
                text: item.text,
            }
        }
    })

     for (const mtg_item of simplifiedMTG_Items) {
        try {
            await prisma.mtg.create(mtg_item)
        } catch (error) {
            console.log(`Error creating MTG item: ${error}`)
        }
    }
}

main()
    .catch((e) => {
    throw e
    })
.finally(async () => {
    await prisma.$disconnect()
})