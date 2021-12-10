
import pkg from '@prisma/client'
const { PrismaClient } = pkg
import { mtgs } from './MTG-api.js'

const prisma = new PrismaClient()

// 107:30 3/31 video preview original

async function main() {

    const simplifiedMTG_Items = mtgs.map(item => {
        return {
            data: {
                name: item.name,
                color: item.colors[0],
                text: item.text,
                mtgType: item.type,
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