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

ENV DATA_DIR /data

RUN mkdir /data
COPY --from=prerelease /usr/src/app/drizzle ./drizzle/
COPY --from=prerelease /usr/src/app/build ./build/
COPY --from=prerelease /usr/src/app/scripts ./scripts/
COPY --from=prerelease /usr/src/app/src/lib/db ./src/lib/db/
COPY --from=prerelease /usr/src/app/src/env.ts ./src/env.ts

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "scripts/start.ts" ]
