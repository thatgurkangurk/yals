FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
ENV DATA_DIR /data
RUN mkdir /data
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm svelte-kit sync
RUN pnpm run build

FROM base
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 yals

ENV DATA_DIR /data
ENV NODE_ENV production

RUN mkdir /data
RUN chown yals:nodejs /data -R
RUN chmod o+w /data -R

COPY --from=prod-deps --chown=yals:nodejs /app/node_modules /app/node_modules
COPY --from=build --chown=yals:nodejs /app/build /app/build
COPY --from=build --chown=yals:nodejs /app/scripts /app/scripts
COPY --from=build --chown=yals:nodejs /app/.svelte-kit /app/.svelte-kit
COPY --chown=yals:nodejs ./entrypoint.sh ./entrypoint.sh

RUN pnpm tsx scripts/migrate.ts

EXPOSE 3000/tcp
CMD pnpm tsx scripts/migrate.ts && node build