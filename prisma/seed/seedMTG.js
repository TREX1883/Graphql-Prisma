const { PrismaClient } = require('@prisma/client')
const mtg_lists = requrie('./mtg-api.js')

const prisma = new PrismaClient()

async function loadUVUCourses() {
    //removed .course after ('mtgs').course because it doesn't work on MTG's api
const allCourses = uvu_courses('mtgs')
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
}

async function main() {
    const allCourses = await loadUVUCourses()
    for (const crs of allCourses) {
        try {
            await prisma.course.create(crs)
        } catch (error) {
            console.log(`Error creating course: ${error}`)
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