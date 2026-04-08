#####################################
# 🧱 Base Stage (Shared setup)
#####################################
FROM node:21.5-alpine AS base-stage

# Set working directory
WORKDIR /app
COPY package*.json ./

RUN rm -rf /var/lib/apt/lists/*
RUN npm update 
RUN npm install
#RUN rm -rf node_modules
RUN rm -rf /root/.npm/_cacache
RUN npm cache clean --force

# =========================
# 🔧 Development Stage
# =========================
FROM base-stage AS dev-stage
# Copy everything for live dev ()
COPY . .
# nodemon for develop
RUN npm install -g nodemon
# Expose default dev port (if using something like nodemon or Vite)
EXPOSE 3000
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV NODE_ENV=development
# Start in development mode
CMD ["npm", "run", "start.dev"]

# =============================
# 🔨 Production Build Stage (Transpilation etc.)
# =============================
FROM base-stage AS build-stage

#RUN npm install esbuild
# Copy source code
COPY . .

# Run your build script using esbuild if you want to bundle
# Not necesary 
# RUN npm run build

# =============================
# 🚀 Production Stage
# =============================
FROM build-stage AS prod-stage

COPY --from=build-stage /app/dist ./dist

# Expose port
EXPOSE 3000
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV NODE_ENV=production
# Start compiled app
CMD ["node", "main.js"]
# Because in strict mode and dist/server.js is trying to use eval could cause problems
# to avoid it include the packages that use it in esbuild.config.js in external 
#CMD ["node", "dist/server.js"] # Run if your build script using esbuild