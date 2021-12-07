import {
  intArg,
  makeSchema,
  nonNull,
  objectType,
  stringArg,
  inputObjectType,
  arg,
  asNexusMethod,
  enumType,
} from 'nexus'
import { DateTimeResolver } from 'graphql-scalars'
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const DateTime = asNexusMethod(DateTimeResolver, 'date')

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('allMtgs', {
      type: 'Mtg',
      resolve: (_parent, _args, context) => {
        return context.prisma.mtg.findMany()
      },
    })

    t.nonNull.list.nonNull.field('allRulings', {
      type: 'Ruling',
      resolve: (_parent, _args, context) => {
        return context.prisma.ruling.findMany()
      },
    })

    t.nullable.field('rulingById', {
      type: 'Ruling',
      args: {
        id: intArg(),
      },
      resolve: (_parent, args, context) => {
        return context.prisma.ruling.findUnique({
          where: { id: args.id || undefined },
        })
      },
    })

    t.nullable.field('mtgById', {
      type: 'Mtg',
      args: {
        id: intArg(),
      },
      resolve: (_parent, args, context) => {
        return context.prisma.mtg.findUnique({
          where: { id: args.id || undefined },
        })
      },
    })
  },
})

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.nonNull.field('createMtg', {
      type: 'Mtg',
      args: {
        data: nonNull(
          arg({
            type: 'MtgCreateInput',
          }),
        ),
      },
      resolve: (_, args, context) => {
        return context.prisma.mtg.create({
          data: {
            name: args.data.name,
            colors: args.data.colors,
            text: args.data.text,
            imageUrl: args.data.imageUrl,
          },
        })
      },
    })

    t.field('createRuling', {
      type: 'Ruling',
      args: {
        data: nonNull(
          arg({
            type: 'RulingCreateInput',
          }),
        ),
        mtgName: nonNull(stringArg()),
      },
      resolve: (_, args, context) => {
        return context.prisma.ruling.create({
          data: {
            date: args.data.date,
            text: args.data.text,
            mtg: {
              connect: { name: args.mtgName },
            },
          },
        })
      },
    })

    t.field('deleteRuling', {
      type: 'Ruling',
      args: {
        id: nonNull(intArg()),
      },
      resolve: (_, args, context) => {
        return context.prisma.ruling.delete({
          where: { id: args.id},
        })
      },
    })

    t.field('deleteMtg', {
      type: 'Mtg',
      args: {
        id: nonNull(intArg()),
      },
      resolve: (_, args, context) => {
        return context.prisma.mtg.delete({
          where: { id: args.id },
        })
      },
    })
  },
})

const Mtg = objectType({
  name: 'Mtg',
  definition(t) {
    t.string('name')
    t.nonNull.int('id')
    t.nonNull.field('createdAt', { type: 'DateTime' })
    t.nonNull.field('updatedAt', { type: 'DateTime' })
    t.string('colors')
    t.string('text')
    t.string('imageUrl')
    t.nonNull.list.nonNull.field('mtgs', {
      type: 'Mtg',
      resolve: (parent, _, context) => {
        return context.prisma.mtg
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .mtgs()
      },
    })
  },
})

const Ruling = objectType({
  name: 'Ruling',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.string('date')
    t.nonNull.string('text')
    t.field('mtg', {
      type: 'Mtg',
      resolve: (parent, _, context) => {
        return context.prisma.ruling
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .mtg()
      },
    })
  },
})

const RulingCreateInput = inputObjectType({
  name: 'RulingCreateInput',
  definition(t) {
    t.string('date')
    t.string('text')
  },
})

const MtgCreateInput = inputObjectType({
  name: 'MtgCreateInput',
  definition(t) {
    t.nonNull.string('name')
    t.string('colors')
    t.string('text')
    t.string('imageUrl')
  },
})

export const schema = makeSchema({
  types: [
    Query,
    Mutation,
    Mtg,
    Ruling,
    MtgCreateInput,
    RulingCreateInput,
    DateTime,
  ],
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
})
