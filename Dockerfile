# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1.1.4 as base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
WORKDIR /usr/src/app
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

ENV DATA_DIR /data
RUN mkdir /data

# [optional] tests & build
ENV NODE_ENV=production
RUN bun x --bun svelte-kit sync
RUN bun run build

# copy production dependencies and source code into final image
FROM base AS release
RUN addgroup --system --gid 1001 bun
RUN adduser --system --uid 1001 yals

ENV DATA_DIR /data

RUN mkdir /data
RUN chown yals:bun /data
COPY --from=prerelease --chown=yals:bun /usr/src/app/drizzle ./drizzle/
COPY --from=prerelease --chown=yals:bun /usr/src/app/build ./build/
COPY --from=prerelease --chown=yals:bun /usr/src/app/scripts ./scripts/
COPY --from=prerelease --chown=yals:bun /usr/src/app/src/lib/db ./src/lib/db/
COPY --from=prerelease --chown=yals:bun /usr/src/app/src/env.ts ./src/env.ts

USER yals

# run the app
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "scripts/start.ts" ]
